// Offer source: the public Tjek API that powers eTilbudsavis.
// Prototype only – for production, license the data (Tjek sells API access) or get
// permission from each chain. Requests go through the polite client in http.js.
//
// Only facts are kept: product name, pack size, price, before-price and validity.
// Images and marketing text are never stored.

import { politeFetch } from './http.js';

const BASE = 'https://squid-api.tjek.com/v2';
const PAGE = 100;

export async function fetchDealerOffers(dealerId, { lat, lng, radius = 50000, max = 1000 } = {}) {
  const offers = [];
  for (let offset = 0; offset < max; offset += PAGE) {
    const url = new URL(`${BASE}/offers`);
    url.search = new URLSearchParams({
      dealer_ids: dealerId,
      r_lat: lat,
      r_lng: lng,
      r_radius: radius,
      limit: PAGE,
      offset
    });
    const res = await politeFetch(url.href, { label: `Tjek ${dealerId} offset ${offset}` });
    const page = await res.json();
    offers.push(...page);
    if (page.length < PAGE) break;
  }
  return offers.map(normalizeOffer);
}

// Flatten a Tjek offer into what the matcher needs. Quantity is expressed in SI
// units (kg, l or pcs) so the matcher can convert to ingredient units.
export function normalizeOffer(o) {
  const q = o.quantity || {};
  const si = q.unit?.si;
  const sizeFrom = q.size?.from ?? null;
  const pieces = q.pieces?.from ?? 1;
  let quantity = null;
  if (si && sizeFrom != null) {
    quantity = { unit: si.symbol, amount: sizeFrom * si.factor * pieces };
  }
  const price = o.pricing?.price ?? null;
  return {
    id: o.id,
    storeId: o.dealer_id,
    heading: o.heading?.trim() ?? '',
    description: '', // marketing text is read for the before-price below, then dropped
    price,
    prePrice: o.pricing?.pre_price ?? prePriceFrom(o.description, price),
    quantity,
    image: null,
    runFrom: iso(o.run_from),
    runTill: iso(o.run_till)
  };
}

// The avis text often states the normal price ("Normalpris 20,75", "Før 29,95",
// "Spar 10,-"). By the Danish price-marking rules that figure must be the lowest
// price of the previous 30 days, so it is a reliable shelf price.
export function prePriceFrom(text, price) {
  if (!text) return null;
  const t = text.replace(/\u00a0/g, ' ');
  const stated = t.match(/\b(?:normalpris|førpris|før|normalt)\s*:?\s*(\d+(?:[.,]\d{1,2})?)(?:[.,]-)?/i);
  if (stated) return money(stated[1]);
  const saved = t.match(/\bspar\s+(?!op\s+til|mindst|min\.)(\d+(?:[.,]\d{1,2})?)(?![\d.,]*\s*%)/i);
  if (saved && price != null) return Math.round((price + money(saved[1])) * 100) / 100;
  return null;
}

const money = (s) => Number(s.replace(',', '.'));

// Tjek dates look like "2026-10-23T22:00:00+0000"; store them as plain UTC ISO strings
// so they compare correctly as text.
const iso = (s) => (s ? new Date(s).toISOString() : null);
