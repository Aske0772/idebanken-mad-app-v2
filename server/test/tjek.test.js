import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOffer, prePriceFrom } from '../src/sources/tjek.js';

test('reads the stated normal price out of the avis text', () => {
  assert.equal(prePriceFrom('400 g.\nPr. kg 24,93\nNormalpris 20,75\nMax. 6 stk.', 9.97), 20.75);
  assert.equal(prePriceFrom('PR. NET\n1 kg. Danmark.\nNormalpris 12.-', 6), 12);
  assert.equal(prePriceFrom('Før 29,95', 19.95), 29.95);
  assert.equal(prePriceFrom('500 g. Spar 10,-', 25), 35);
  assert.equal(prePriceFrom('Spar op til 50%', 25), null);
  assert.equal(prePriceFrom('Spar 20%', 25), null);
  assert.equal(prePriceFrom('400 g. 72.50 pr. kg', 29), null);
  assert.equal(prePriceFrom('', 29), null);
});

test('keeps only facts: no image, no marketing text, before-price from text when missing', () => {
  const o = normalizeOffer({
    id: 'x', dealer_id: '9ba51', heading: ' Mutti tomater ', description: '400 g. Normalpris 20,75',
    pricing: { price: 9.97, pre_price: null }, images: { thumb: 'https://img/x.jpg' },
    quantity: { unit: { si: { symbol: 'kg', factor: 0.001 } }, size: { from: 400 }, pieces: { from: 1 } },
    run_from: '2026-10-23T22:00:00+0000', run_till: '2026-10-30T22:00:00+0000'
  });
  assert.equal(o.image, null);
  assert.equal(o.description, '');
  assert.equal(o.prePrice, 20.75);
  assert.deepEqual(o.quantity, { unit: 'kg', amount: 0.4 });
  assert.equal(o.heading, 'Mutti tomater');
});
