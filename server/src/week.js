import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { STORES } from './stores.js';
import { INGREDIENTS, CATEGORIES } from './ingredients.js';
import { fetchDealerOffers } from './sources/tjek.js';
import { isDisabled, SourceBlockedError } from './sources/http.js';
import { fetchRemaShelf, REMA_STORE_ID } from './sources/rema.js';
import { fetchLidlShelf, LIDL_STORE_ID } from './sources/lidl.js';
import { matchOffer } from './match.js';
import { DATA_DIR } from './db.js';

export const IMAGE_DIR = join(DATA_DIR, 'images');
const IMAGE_EXT = ['webp', 'jpg', 'jpeg', 'png'];

// An avis offer runs about a week. Anything valid for longer is a catalog price
// ("fast lav pris", brand catalogs): a real price, but not a tilbud.
const TILBUD_MAX_DAYS = 14;
// Shelf products kept per ingredient in the payload: enough pack sizes to choose from.
const SHELF_PER_INGREDIENT = 4;

// ISO 8601 week key, e.g. "2026-W44".
export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function offerKind(offer) {
  if (!offer.runFrom || !offer.runTill) return 'fast';
  const days = (Date.parse(offer.runTill) - Date.parse(offer.runFrom)) / 86400000;
  return days <= TILBUD_MAX_DAYS ? 'tilbud' : 'fast';
}

const location = () => ({
  lat: Number(process.env.LAT ?? 55.6761),
  lng: Number(process.env.LNG ?? 12.5683)
});

// Chains whose everyday (shelf) prices we can read, by store id.
export const SHELF_SOURCES = { [REMA_STORE_ID]: fetchRemaShelf, [LIDL_STORE_ID]: fetchLidlShelf };
// Source names, used by the DISABLED_SOURCES kill switch and the source_runs log.
export const OFFER_SOURCE = 'tjek';
const SHELF_SOURCE_NAMES = { [REMA_STORE_ID]: 'rema', [LIDL_STORE_ID]: 'lidl' };
// A source that blocks us (401/403/429) is left alone for this long.
const BLOCK_COOLDOWN_HOURS = Number(process.env.BLOCK_COOLDOWN_HOURS ?? 24);

const storeName = (id) => STORES.find((s) => s.id === id)?.name ?? id;

// Why a source must not be called right now, or null when it may.
export function sourcePause(db, source, now = Date.now()) {
  if (isDisabled(source)) return `${source}: slået fra (DISABLED_SOURCES)`;
  const run = db.prepare('SELECT ran_at, ok, note FROM source_runs WHERE source = ?').get(source);
  if (!run || run.ok || !/blokeret/.test(run.note ?? '')) return null;
  const until = Date.parse(run.ran_at) + BLOCK_COOLDOWN_HOURS * 3600_000;
  if (now >= until) return null;
  return `${source}: ${run.note} – pause til ${new Date(until).toISOString()}`;
}

// Fetch every store's avis plus the shelf prices we have, match them to
// ingredients and store the week's dishes. A source that fails, blocks us or is
// switched off keeps its last good prices: those still valid are carried into
// the new week, so the app never empties because one host went dark.
export async function refreshWeek(db, {
  fetchOffers = fetchDealerOffers,
  fetchShelves = SHELF_SOURCES,
  log = console.log,
  now = () => Date.now()
} = {}) {
  const week = weekKey(new Date(now()));
  const errors = [];
  const offers = [];
  const fetched = new Set();
  const runs = []; // [source, ok, note]

  const offerPause = sourcePause(db, OFFER_SOURCE, now());
  if (offerPause) {
    errors.push(offerPause);
    log(`  ${offerPause}`);
  } else {
    let blocked = null;
    for (const store of STORES) {
      if (blocked) break; // one block is enough: stop knocking on that door
      try {
        const got = await fetchOffers(store.id, location());
        log(`  ${store.name.padEnd(14)} ${got.length} tilbud`);
        offers.push(...got);
        fetched.add(store.id);
      } catch (err) {
        if (err instanceof SourceBlockedError) blocked = err.message;
        errors.push(`${store.name}: ${err.message}`);
        log(`  ${store.name.padEnd(14)} FEJL ${err.message}`);
      }
    }
    const ok = !blocked && fetched.size > 0;
    runs.push([OFFER_SOURCE, ok ? 1 : 0, blocked ?? (ok ? null : 'ingen butik svarede')]);
  }

  const shelf = [];
  const shelfFetched = new Set();
  for (const [storeId, fetchShelf] of Object.entries(fetchShelves)) {
    const source = SHELF_SOURCE_NAMES[storeId] ?? storeId;
    const label = `${storeName(storeId)} hyldepriser`;
    const pause = sourcePause(db, source, now());
    if (pause) {
      errors.push(pause);
      log(`  ${pause}`);
      continue;
    }
    try {
      const got = await fetchShelf();
      log(`  ${label} ${got.length} varer`);
      shelf.push(...got);
      shelfFetched.add(storeId);
      runs.push([source, 1, null]);
    } catch (err) {
      errors.push(`${label}: ${err.message}`);
      log(`  ${label} FEJL ${err.message}`);
      runs.push([source, 0, err.message]);
    }
  }

  const upsertStore = db.prepare(
    'INSERT OR REPLACE INTO stores (id, slug, name, color) VALUES (?, ?, ?, ?)'
  );
  const insertOffer = db.prepare(`
    INSERT OR REPLACE INTO offers
      (id, week, store_id, heading, description, price, pre_price, image, run_from, run_till, kind)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMatch = db.prepare(
    'INSERT OR REPLACE INTO offer_matches (offer_id, week, ingredient_id, amount, assumed) VALUES (?, ?, ?, ?, ?)'
  );
  const upsertRun = db.prepare(
    'INSERT OR REPLACE INTO source_runs (source, ran_at, ok, note) VALUES (?, ?, ?, ?)'
  );
  // Only facts are stored: name, pack size, price, before-price, validity. Never images.
  const store = (o, kind, matches) => {
    insertOffer.run(o.id, week, o.storeId, o.heading, o.description, o.price, o.prePrice,
      null, o.runFrom, o.runTill, kind);
    for (const m of matches) insertMatch.run(o.id, week, m.ingredientId, m.amount, m.assumed ? 1 : 0);
  };

  const nowIso = new Date(now()).toISOString();
  db.exec('BEGIN');
  try {
    for (const s of STORES) upsertStore.run(s.id, s.slug, s.name, s.color);
    // Replace only what was fetched successfully this time.
    const clear = (where, ...args) => {
      db.prepare(`DELETE FROM offer_matches WHERE week = ? AND offer_id IN (SELECT id FROM offers WHERE week = ? AND ${where})`)
        .run(week, week, ...args);
      db.prepare(`DELETE FROM offers WHERE week = ? AND ${where}`).run(week, ...args);
    };
    for (const storeId of fetched) clear("store_id = ? AND kind != 'hylde'", storeId);
    for (const storeId of shelfFetched) clear("store_id = ? AND kind = 'hylde'", storeId);
    db.prepare('DELETE FROM week_recipes WHERE week = ?').run(week);
    for (const o of offers) {
      const matches = matchOffer(o);
      if (matches.length === 0) continue; // only food we can cook with is kept
      store(o, offerKind(o), matches);
    }
    for (const p of shelf) {
      const matches = matchOffer(p, { shelf: true });
      if (matches.length === 0) continue;
      store(p, 'hylde', matches);
    }
    // Stores we did not reach this time keep what is still valid from the last week we did.
    for (const s of STORES) {
      if (!fetched.has(s.id)) carryForward(db, week, s.id, 'avis', nowIso);
      if (!shelfFetched.has(s.id)) carryForward(db, week, s.id, 'hylde', nowIso);
    }
    const counts = { tilbud: 0, fast: 0, hylde: 0 };
    for (const r of db.prepare('SELECT kind, COUNT(*) AS n FROM offers WHERE week = ? GROUP BY kind').all(week)) {
      counts[r.kind] = r.n;
    }
    if (counts.tilbud + counts.fast === 0) throw new Error(`Ingen tilbud hentet. ${errors.join('; ')}`);
    const dishes = storeWeekRecipes(db, week, nowIso);
    for (const [source, ok, note] of runs) upsertRun.run(source, nowIso, ok, note);
    db.prepare('INSERT OR REPLACE INTO weeks (week, refreshed_at, offer_count, errors) VALUES (?, ?, ?, ?)')
      .run(week, nowIso, counts.tilbud, JSON.stringify(errors));
    db.exec('COMMIT');
    log(`  ${counts.tilbud} ugetilbud, ${counts.fast} faste priser, ${counts.hylde} hyldepriser, ${dishes} retter`);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return week;
}

// Copy a store's still-valid prices (and their ingredient matches) from the most
// recent earlier week into this one, unless this week already has some.
// group: 'avis' (tilbud + fast) or 'hylde'.
function carryForward(db, week, storeId, group, nowIso) {
  const kind = group === 'hylde' ? "o.kind = 'hylde'" : "o.kind != 'hylde'";
  const rowsIn = `FROM offers o WHERE o.week = ? AND o.store_id = ? AND ${kind}`;
  if (db.prepare(`SELECT 1 ${rowsIn} LIMIT 1`).get(week, storeId)) return;
  const prev = db.prepare(`SELECT MAX(o.week) AS w FROM offers o WHERE o.week < ? AND o.store_id = ? AND ${kind}`)
    .get(week, storeId)?.w;
  if (!prev) return;
  const valid = '(o.run_till IS NULL OR o.run_till > ?)';
  db.prepare(`
    INSERT OR IGNORE INTO offers (id, week, store_id, heading, description, price, pre_price, image, run_from, run_till, kind)
    SELECT o.id, ?, o.store_id, o.heading, o.description, o.price, o.pre_price, o.image, o.run_from, o.run_till, o.kind
    ${rowsIn} AND ${valid}
  `).run(week, prev, storeId, nowIso);
  db.prepare(`
    INSERT OR IGNORE INTO offer_matches (offer_id, week, ingredient_id, amount, assumed)
    SELECT m.offer_id, ?, m.ingredient_id, m.amount, m.assumed
    FROM offer_matches m JOIN offers o ON o.id = m.offer_id AND o.week = m.week
    WHERE o.week = ? AND o.store_id = ? AND ${kind} AND ${valid}
  `).run(week, prev, storeId, nowIso);
}

const ACTIVE = '(o.run_from IS NULL OR o.run_from <= ?) AND (o.run_till IS NULL OR o.run_till > ?)';

// A dish makes this week's deck when a hero ingredient is in a running avis tilbud.
function storeWeekRecipes(db, week, now = new Date().toISOString()) {
  const heroOffers = db.prepare(`
    SELECT m.offer_id, o.store_id FROM offer_matches m JOIN offers o ON o.id = m.offer_id AND o.week = m.week
    WHERE m.week = ? AND m.ingredient_id = ? AND o.kind = 'tilbud' AND ${ACTIVE}
  `);
  const insert = db.prepare(
    'INSERT INTO week_recipes (week, recipe_id, hero_offers, store_ids) VALUES (?, ?, ?, ?)'
  );
  let count = 0;
  for (const r of db.prepare('SELECT id, data FROM recipes').all()) {
    const { hero } = JSON.parse(r.data);
    const rows = hero.flatMap((ing) => heroOffers.all(week, ing, now, now));
    if (rows.length === 0) continue;
    const storeIds = [...new Set(rows.map((x) => x.store_id))];
    insert.run(week, r.id, JSON.stringify(rows.map((x) => x.offer_id)), JSON.stringify(storeIds));
    count++;
  }
  return count;
}

export function latestWeek(db) {
  return db.prepare('SELECT * FROM weeks ORDER BY week DESC LIMIT 1').get() ?? null;
}

function imageFor(id) {
  for (const ext of IMAGE_EXT) {
    if (existsSync(join(IMAGE_DIR, `${id}.${ext}`))) return `/images/${id}.${ext}`;
  }
  return null;
}

// Everything the client needs to price dishes for any store selection.
// Only prices that are valid right now are included.
export function weekPayload(db, week) {
  const meta = db.prepare('SELECT * FROM weeks WHERE week = ?').get(week);
  const now = new Date().toISOString();

  const counts = Object.fromEntries(
    db.prepare(`SELECT store_id, COUNT(*) AS n FROM offers o WHERE week = ? AND kind = 'tilbud' AND ${ACTIVE} GROUP BY store_id`)
      .all(week, now, now).map((r) => [r.store_id, r.n])
  );
  const stores = db.prepare('SELECT * FROM stores').all()
    .map((s) => ({ ...s, offerCount: counts[s.id] ?? 0 }))
    .sort((a, b) => STORES.findIndex((x) => x.id === a.id) - STORES.findIndex((x) => x.id === b.id));

  const offers = {};
  const rows = db.prepare(`
    SELECT m.ingredient_id, m.amount, m.assumed, o.id, o.store_id, o.heading, o.price,
           o.pre_price, o.run_from, o.run_till, o.kind
    FROM offer_matches m JOIN offers o ON o.id = m.offer_id AND o.week = m.week
    WHERE m.week = ? AND ${ACTIVE}
  `).all(week, now, now);
  const shelf = {};
  for (const r of rows) {
    const entry = {
      id: r.id, store: r.store_id, title: r.heading, price: r.price, prePrice: r.pre_price,
      amount: r.amount, assumed: !!r.assumed, from: r.run_from, until: r.run_till, kind: r.kind
    };
    if (r.kind === 'hylde') (shelf[r.ingredient_id] ??= []).push(entry);
    else (offers[r.ingredient_id] ??= []).push(entry);
  }
  for (const [id, list] of Object.entries(shelf)) {
    (offers[id] ??= []).push(...pickShelf(list));
  }

  // All recipes are sent so dishes already in someone's plan can still be priced after
  // their tilbud ends; the client builds the deck from those with a running tilbud.
  const recipes = db.prepare(`
    SELECT r.*, w.recipe_id IS NOT NULL AS in_week FROM recipes r
    LEFT JOIN week_recipes w ON w.recipe_id = r.id AND w.week = ?
  `).all(week).map((r) => {
    const data = JSON.parse(r.data);
    return {
      id: r.id, title: r.title, blurb: r.blurb, minutes: r.minutes, diet: r.diet,
      serves: r.serves, emoji: r.emoji, hue: r.hue, inWeek: !!r.in_week,
      image: r.image ?? imageFor(r.id),
      hero: data.hero,
      ingredients: data.ingredients.map(([id, qty]) => ({ id, qty })),
      steps: data.steps
    };
  });

  const ingredients = Object.fromEntries(
    Object.entries(INGREDIENTS).map(([id, i]) => [id, {
      name: i.name, unit: i.unit, cat: i.cat, staple: !!i.staple,
      normal: i.normal, label: i.label ?? null, gPerStk: i.gPerStk ?? null
    }])
  );

  // When each source last answered, so the client can say "sidst hentet" per chain.
  const sources = db.prepare('SELECT source, ran_at, ok, note FROM source_runs').all()
    .map((r) => ({ id: r.source, ranAt: r.ran_at, ok: !!r.ok, note: r.note }));

  return {
    week, refreshedAt: meta?.refreshed_at, generatedAt: now, errors: JSON.parse(meta?.errors ?? '[]'),
    sources, stores, categories: CATEGORIES, ingredients, recipes, offers
  };
}

// Cheapest products per unit, plus the smallest pack so small needs aren't forced
// into a family-size bag.
function pickShelf(list) {
  const byUnit = [...list].sort((a, b) => a.price / a.amount - b.price / b.amount);
  const picked = byUnit.slice(0, SHELF_PER_INGREDIENT);
  const smallest = [...list].sort((a, b) => a.amount - b.amount)[0];
  if (smallest && !picked.includes(smallest)) picked.push(smallest);
  return picked;
}
