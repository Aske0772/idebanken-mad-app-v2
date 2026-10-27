// Shelf prices: Lidl's everyday prices from lidl.dk.
//
// Lidl has no grocery webshop, but some pages list fixed-price products as
// tiles with structured data (title, price, pack size). Tiles without an end
// date are everyday prices; tiles with one are offers and come from the avis.
// Only facts are kept. Same prototype caveat as the other sources.

import { politeFetch } from './http.js';

export const LIDL_STORE_ID = '71c90';
const PAGES = [
  'https://www.lidl.dk/c/hverdagensfavoritter/a10105653',
  'https://www.lidl.dk/c/madvaerket/a10105652'
];

export async function fetchLidlShelf() {
  const products = new Map();
  for (const url of PAGES) {
    const res = await politeFetch(url, { accept: 'text/html', label: `lidl.dk ${new URL(url).pathname}` });
    for (const p of parseTiles(await res.text())) products.set(p.id, p);
  }
  return [...products.values()];
}

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Product tiles carry their data as JSON in a data-grid-data attribute.
export function parseTiles(html) {
  const out = [];
  for (const [, raw] of html.matchAll(/data-grid-data="([^"]+)"/g)) {
    let tile;
    try {
      tile = JSON.parse(decode(raw));
    } catch {
      continue;
    }
    const price = tile.price?.price;
    if (tile.category !== 'Food' || typeof price !== 'number' || price <= 0) continue; // Lidl Plus-only prices have none
    if (tile.storeEndDate) continue; // has an end date: an offer, not an everyday price
    const pack = tile.price.packaging?.text ?? '';
    out.push({
      id: `lidl-${tile.productId}`,
      storeId: LIDL_STORE_ID,
      heading: tile.fullTitle?.trim() ?? '',
      description: [pack, tile.price.basePrice?.text].filter(Boolean).join(' · '),
      price,
      prePrice: null,
      quantity: parsePack(pack),
      image: null,
      runFrom: tile.storeStartDate ? new Date(tile.storeStartDate * 1000).toISOString() : null,
      runTill: null
    });
  }
  return out;
}

// "600 g" → 0.6 kg; "1 l"; "500-1000 ml" → from 0.5 l; "100 x 15,25 g"; "1/Stk."
export function parsePack(text) {
  const t = text.toLowerCase().replace(',', '.');
  if (/^\d*\s*\/?\s*stk/.test(t)) return { unit: 'pcs', amount: Number(t.match(/^\d+/)?.[0] ?? 1) };
  const m = t.match(/^(?:(\d+)\s*x\s*)?(\d+(?:\.\d+)?)(?:\s*-\s*\d+(?:\.\d+)?)?\s*(kg|g|ml|cl|l|stk)\b/);
  if (!m) return null;
  const [, times, value, unit] = m;
  const [si, factor] = { g: ['kg', 0.001], kg: ['kg', 1], ml: ['l', 0.001], cl: ['l', 0.01], l: ['l', 1], stk: ['pcs', 1] }[unit];
  return { unit: si, amount: Math.round((times ? Number(times) : 1) * Number(value) * factor * 1e6) / 1e6 };
}
