// Free-text search for the Opskrifter and Priser tabs. Everything runs on the week
// payload already in the app, so it works the same with the API and with week.json.
import { isOnOffer, portionPrice } from './pricing.js';

// Lower case and without accents, so "creme" finds "crème". Æ, ø and å are letters
// of their own in Danish and are kept.
export const normalize = (s) =>
  s.toLowerCase().normalize('NFD').replace(/(?![̊])[̀-ͯ]/g, '').normalize('NFC').trim();

const terms = (query) => normalize(query).split(/\s+/).filter(Boolean);

// Dishes where every word of the query is in the title, the blurb or a (non-basis)
// ingredient. Title hits first, then dishes on tilbud in your stores, then cheapest.
export function searchRecipes(data, query, { stores, people = 2, atHome = [] }) {
  const words = terms(query);
  const results = [];
  for (const recipe of data.recipes) {
    const names = recipe.ingredients
      .map(({ id }) => data.ingredients[id])
      .filter((ing) => ing && !ing.staple)
      .map((ing) => normalize(ing.name));
    const title = normalize(recipe.title);
    const text = [title, normalize(recipe.blurb ?? ''), ...names].join(' ');
    if (!words.every((w) => text.includes(w))) continue;
    results.push({
      recipe,
      inTitle: words.length > 0 && words.every((w) => title.includes(w)),
      matched: names.filter((n) => words.some((w) => n.includes(w))),
      onOffer: isOnOffer(data, recipe, stores),
      price: portionPrice(data, recipe, stores, people, atHome)
    });
  }
  return results.sort((a, b) =>
    (b.inTitle - a.inTitle) || (b.onOffer - a.onOffer) || (a.price - b.price));
}

// Price per kg, per litre or per piece, so packs of different sizes compare fairly.
export function unitPrice(offer, ing) {
  const per = ing.unit === 'stk' ? 1 : 1000;
  return (offer.price / offer.amount) * per;
}

export const unitLabel = (ing) => (ing.unit === 'g' ? 'kg' : ing.unit === 'ml' ? 'l' : ing.label ?? 'stk');

// Every store's best price per unit for the ingredients matching the query. An
// ingredient matches on its own name ("laks"), or on the product names in the
// avis ("laksefilet") – then only those products count, and not one already shown
// under a name match ("laks eller rejer" stays under laks, not also under rejer).
export function searchPrices(data, query, { stores }) {
  const words = terms(query);
  if (words.length === 0) return [];
  const hits = (s) => words.every((w) => normalize(s).includes(w));
  const offersOf = (id) => (data.offers[id] ?? []).filter((o) => stores.includes(o.store) && o.amount > 0);
  const named = Object.keys(data.ingredients).filter((id) => hits(data.ingredients[id].name));
  const shown = new Set(named.flatMap((id) => offersOf(id).map((o) => o.id)));
  const results = [];
  for (const [id, ing] of Object.entries(data.ingredients)) {
    const byName = named.includes(id);
    const offers = byName ? offersOf(id) : offersOf(id).filter((o) => hits(o.title) && !shown.has(o.id));
    if (offers.length === 0) continue;

    const best = new Map();
    for (const offer of offers) {
      const per = unitPrice(offer, ing);
      const cur = best.get(offer.store);
      if (!cur || per < cur.per) best.set(offer.store, { store: offer.store, offer, per });
    }
    const rows = [...best.values()].sort((a, b) => a.per - b.per);
    results.push({
      id, ing, byName, rows,
      missing: stores.filter((s) => !best.has(s)),
      startsWith: normalize(ing.name).startsWith(words[0])
    });
  }
  return results.sort((a, b) =>
    (b.byName - a.byName) || (b.startsWith - a.startsWith) || (b.rows.length - a.rows.length) || a.ing.name.localeCompare(b.ing.name, 'da'));
}

// Ingredients on a running avis tilbud in the given stores: search suggestions.
export function onTilbud(data, stores, limit = 12) {
  return Object.entries(data.ingredients)
    .filter(([id, ing]) => !ing.staple && (data.offers[id] ?? []).some((o) => (o.kind ?? 'tilbud') === 'tilbud' && stores.includes(o.store)))
    .map(([id, ing]) => ({ id, name: ing.name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'da'))
    .slice(0, limit);
}
