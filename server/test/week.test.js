import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { refreshWeek, weekPayload, weekKey, offerKind } from '../src/week.js';
import { SourceBlockedError } from '../src/sources/http.js';

const day = 86400000;
const at = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString();
const offer = (id, storeId, heading, price, kg, runFrom = at(-1), runTill = at(5)) => ({
  id, storeId, heading, description: '', price, prePrice: null,
  quantity: kg ? { unit: 'kg', amount: kg } : null, image: null, runFrom, runTill
});

const FAKE = {
  '9ba51': [
    offer('a', '9ba51', 'Dansk kyllingebrystfilet', 25, 0.4),
    offer('b', '9ba51', 'Lays chips', 12, 0.175),
    offer('expired', '9ba51', 'Hakket oksekød', 30, 0.5, at(-8), at(-1)),
    offer('future', '9ba51', 'Dansk laksefilet', 50, 0.5, at(2), at(9))
  ],
  '11deC': [offer('c', '11deC', 'REMA 1000 Danske laksefileter', 39, 0.225)],
  // A brand catalog valid for months: a real price, but not a tilbud.
  '71c90': [offer('d', '71c90', 'MADVÆRKET Bacon i strimler', 19.95, 0.25, at(-60), at(60))]
};
const SHELF = [{
  id: 'rema-1', storeId: '11deC', heading: 'Parboiled ris', description: '1 KG. / REMA 1000',
  price: 11.95, prePrice: null, quantity: { unit: 'kg', amount: 1 }, image: null,
  runFrom: at(-10), runTill: at(20)
}];
// Lidl's everyday prices have no end date.
const LIDL_SHELF = [{
  id: 'lidl-1', storeId: '71c90', heading: 'Sukker', description: '1 kg · Pr. kg 6,00',
  price: 6, prePrice: null, quantity: { unit: 'kg', amount: 1 }, image: null,
  runFrom: at(-30), runTill: null
}];
const SHELVES = { '11deC': async () => SHELF, '71c90': async () => LIDL_SHELF };

const refresh = (db, extra = {}) => refreshWeek(db, {
  fetchOffers: async (id) => FAKE[id] ?? [],
  fetchShelves: SHELVES,
  log: () => {},
  ...extra
});

test('refreshWeek stores matched offers and the dishes they unlock', async () => {
  const db = openDb(':memory:');
  const week = await refresh(db);
  assert.equal(week, weekKey());

  const payload = weekPayload(db, week);
  assert.equal(payload.offers.kyllingebryst.length, 1);
  assert.equal(payload.offers.kyllingebryst[0].amount, 400);
  assert.equal(payload.offers.kyllingebryst[0].kind, 'tilbud');
  assert.equal(payload.offers.laks[0].store, '11deC');
  assert.equal(Object.values(payload.offers).flat().some((o) => o.title.includes('chips')), false);

  const inWeek = payload.recipes.filter((r) => r.inWeek).map((r) => r.id);
  assert.ok(inWeek.includes('kylling-i-karry'));
  assert.ok(inWeek.includes('ovnlaks-kartofler'));
  assert.ok(!inWeek.includes('carbonara'), 'bacon is only a catalog price, not a tilbud');
  assert.equal(payload.stores.find((s) => s.id === '9ba51').offerCount, 1);
});

test('only prices valid right now are sent', async () => {
  const db = openDb(':memory:');
  const payload = weekPayload(db, await refresh(db));
  const ids = Object.values(payload.offers).flat().map((o) => o.id);
  assert.ok(!ids.includes('expired'));
  assert.ok(!ids.includes('future'));
});

test('catalog and shelf prices are kept, labelled by kind', async () => {
  const db = openDb(':memory:');
  const payload = weekPayload(db, await refresh(db));
  assert.equal(payload.offers.bacon[0].kind, 'fast');
  assert.deepEqual(payload.offers.ris.map((o) => [o.kind, o.price]), [['hylde', 11.95]]);
  assert.deepEqual(payload.offers.sukker.map((o) => [o.kind, o.store, o.price]), [['hylde', '71c90', 6]]);
});

test('every recipe is sent so planned dishes can still be priced', async () => {
  const db = openDb(':memory:');
  const payload = weekPayload(db, await refresh(db));
  assert.ok(payload.recipes.some((r) => r.id === 'carbonara' && !r.inWeek));
});

test('a store that fails keeps its last good offers', async () => {
  const db = openDb(':memory:');
  await refresh(db);
  await refresh(db, {
    fetchOffers: async (id) => {
      if (id === '9ba51') throw new Error('netto.dk nede');
      return FAKE[id] ?? [];
    }
  });
  const payload = weekPayload(db, weekKey());
  assert.equal(payload.offers.kyllingebryst[0].store, '9ba51');
  assert.match(payload.errors.join(), /netto.dk nede/);
});

test('a failing shelf source keeps its last good prices and leaves the others alone', async () => {
  const db = openDb(':memory:');
  await refresh(db);
  await refresh(db, {
    fetchShelves: { ...SHELVES, '11deC': async () => { throw new Error('offline'); } }
  });
  const payload = weekPayload(db, weekKey());
  assert.match(payload.errors.join(), /REMA 1000 hyldepriser: offline/);
  assert.equal(payload.offers.ris[0].price, 11.95);
  assert.equal(payload.offers.sukker[0].store, '71c90');
});

test('refreshWeek fails loudly when no store answers', async () => {
  const db = openDb(':memory:');
  await assert.rejects(
    refresh(db, { fetchOffers: async () => { throw new Error('offline'); } }),
    /Ingen tilbud/
  );
});

test('offerKind splits weekly avis from long-running catalogs', () => {
  assert.equal(offerKind({ runFrom: at(0), runTill: at(7) }), 'tilbud');
  assert.equal(offerKind({ runFrom: at(0), runTill: at(60) }), 'fast');
  assert.equal(offerKind({ runFrom: null, runTill: at(3) }), 'fast');
});

test('a source switched off with DISABLED_SOURCES is not called and keeps its prices', async () => {
  const db = openDb(':memory:');
  await refresh(db);
  process.env.DISABLED_SOURCES = 'tjek, rema';
  try {
    let calls = 0;
    await refresh(db, {
      fetchOffers: async () => { calls++; return []; },
      fetchShelves: { ...SHELVES, '11deC': async () => { calls++; return SHELF; } }
    });
    assert.equal(calls, 0);
  } finally {
    delete process.env.DISABLED_SOURCES;
  }
  const payload = weekPayload(db, weekKey());
  assert.equal(payload.offers.kyllingebryst[0].store, '9ba51');
  assert.equal(payload.offers.ris[0].price, 11.95);
  assert.match(payload.errors.join(), /tjek: slået fra/);
  assert.match(payload.errors.join(), /rema: slået fra/);
  assert.equal(payload.sources.find((s) => s.id === 'lidl').ok, true);
});

test('a source that blocks us is left alone for a day, then tried again', async () => {
  const db = openDb(':memory:');
  const t0 = Date.now();
  await refresh(db, { now: () => t0 });
  let calls = 0;
  const blocked = async () => { calls++; throw new SourceBlockedError('https://squid-api.tjek.com/v2/offers', 403); };

  await refresh(db, { fetchOffers: blocked, now: () => t0 + 1000 });
  assert.equal(calls, 1, 'stops after the first store is blocked');
  let payload = weekPayload(db, weekKey());
  assert.equal(payload.offers.kyllingebryst[0].store, '9ba51', 'last good offers survive');
  assert.match(payload.sources.find((s) => s.id === 'tjek').note, /blokeret \(HTTP 403\)/);

  await refresh(db, { fetchOffers: blocked, now: () => t0 + 2 * 3600_000 });
  assert.equal(calls, 1, 'not called again inside the cooldown');
  payload = weekPayload(db, weekKey());
  assert.match(payload.errors.join(), /tjek: blokeret .* pause til/);

  await refresh(db, { fetchOffers: blocked, now: () => t0 + 25 * 3600_000 });
  assert.equal(calls, 2, 'tried again after the cooldown');
});

test('valid prices are carried into a new week when a store cannot be reached', async () => {
  const db = openDb(':memory:');
  const lastWeek = Date.now() - 7 * day;
  // Last week: a Netto tilbud still valid for a few more days, and REMA shelf prices.
  await refresh(db, {
    fetchOffers: async (id) => (id === '9ba51' ? [offer('n1', '9ba51', 'Dansk kyllingebrystfilet', 25, 0.4, at(-8), at(3)),
      offer('n2', '9ba51', 'Dansk laksefilet', 50, 0.5, at(-8), at(-1))] : FAKE[id] ?? []),
    now: () => lastWeek
  });
  // This week: Netto and REMA are down; Lidl answers.
  await refresh(db, {
    fetchOffers: async (id) => { if (id === '9ba51') throw new Error('nede'); return FAKE[id] ?? []; },
    fetchShelves: { ...SHELVES, '11deC': async () => { throw new Error('nede'); } }
  });
  const payload = weekPayload(db, weekKey());
  const netto = Object.values(payload.offers).flat().filter((o) => o.store === '9ba51');
  assert.deepEqual(netto.map((o) => o.id), ['n1'], 'only the still-valid tilbud is carried');
  assert.equal(payload.offers.ris[0].price, 11.95, 'shelf prices carried too');
  assert.ok(payload.recipes.find((r) => r.id === 'kylling-i-karry').inWeek, 'carried tilbud still unlock dishes');
});

test('offers in the payload carry no images', async () => {
  const db = openDb(':memory:');
  const payload = weekPayload(db, await refresh(db));
  assert.ok(Object.values(payload.offers).flat().every((o) => !('image' in o)));
});
