// Shelf prices: REMA 1000's public webshop API lists the whole assortment with
// current prices and validity dates. We use it as the real "normal price" for
// ingredients that aren't on offer. Same prototype caveat as tjek.js. Only facts
// are kept (name, pack size, price, validity); no images.

import { politeFetch } from './http.js';

const BASE = 'https://api.digital.rema1000.dk/api/v3';
// Food departments only (bread, produce, meat/fish, chilled, frozen, dairy, cheese, groceries).
const DEPARTMENTS = [10, 20, 30, 40, 50, 60, 70, 80];
export const REMA_STORE_ID = '11deC';

export async function fetchRemaShelf() {
  const products = [];
  for (const dept of DEPARTMENTS) {
    for (let page = 1; page < 50; page++) {
      const res = await politeFetch(`${BASE}/departments/${dept}/products?per_page=100&page=${page}`, {
        label: `REMA afdeling ${dept} side ${page}`
      });
      const body = await res.json();
      for (const p of body.data) {
        const product = normalizeProduct(p);
        if (product) products.push(product);
      }
      if (page >= body.meta.pagination.last_page) break;
    }
  }
  return products;
}

// Only regular (non-campaign) prices: campaign prices already arrive via the avis.
export function normalizeProduct(p) {
  const price = p.prices?.find((x) => !x.is_campaign && !x.is_advertised);
  if (!price?.price) return null;
  return {
    id: `rema-${p.id}`,
    storeId: REMA_STORE_ID,
    heading: titleCase(p.name),
    description: p.underline ?? '',
    price: price.price,
    prePrice: null,
    quantity: parseSize(p.underline),
    image: null,
    runFrom: iso(price.starting_at),
    runTill: iso(price.ending_at)
  };
}

const UNITS = {
  GR: ['kg', 0.001], G: ['kg', 0.001], KG: ['kg', 1],
  ML: ['l', 0.001], CL: ['l', 0.01], DL: ['l', 0.1], LTR: ['l', 1], L: ['l', 1],
  STK: ['pcs', 1], BDT: ['pcs', 1], PK: ['pcs', 1], DS: ['pcs', 1]
};

// "530 GR. / KLASSISK" → { unit: 'kg', amount: 0.53 }; "4 X 125 GR." → 0.5 kg
export function parseSize(underline) {
  if (!underline) return null;
  const head = underline.split('/')[0].trim().toUpperCase().replace(',', '.');
  const m = head.match(/^(?:(\d+)\s*X\s*)?(\d+(?:\.\d+)?)(?:\s*-\s*\d+(?:\.\d+)?)?\s*([A-Z]+)\.?/);
  if (!m) return null;
  const unit = UNITS[m[3]];
  if (!unit) return null;
  const count = m[1] ? Number(m[1]) : 1;
  return { unit: unit[0], amount: count * Number(m[2]) * unit[1] };
}

const iso = (s) => (s ? new Date(s).toISOString() : null);
const titleCase = (s) => s.charAt(0) + s.slice(1).toLowerCase();
