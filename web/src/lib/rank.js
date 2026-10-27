// Deck order. The deck should feel new every week without the user doing
// anything: cheap dishes first, deep discounts pulled forward, and dishes the
// user cooked in the last couple of weeks pushed to the back.

// How much a discount moves a dish forward: a 40 % discount makes the portion
// price count as 20 % lower when sorting.
export const DEPTH_WEIGHT = 0.5;
// Dishes planned in this many earlier weeks go to the back of the deck…
export const ROTATION_WEEKS = 2;
// …unless a hero ingredient is at least this much off: a great tilbud may come back.
export const COMEBACK_DEPTH = 0.5;
// Weeks of past plans kept on the phone.
export const HISTORY_WEEKS = 4;

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

// What one unit of an ingredient normally costs: the median shelf price across
// chains when we have one, otherwise our own normal price.
function normalUnitPrice(data, ingredientId) {
  const shelf = (data.offers[ingredientId] ?? []).filter((o) => o.kind === 'hylde' && o.amount > 0);
  if (shelf.length) return median(shelf.map((o) => o.price / o.amount));
  const [size, price] = data.ingredients[ingredientId].normal;
  return price / size;
}

// How far below its normal price an offer is, 0–1. The before-price printed in
// the avis wins when there is one; it is by law the lowest price of the last 30 days.
export function offerDepth(data, ingredientId, offer) {
  if (!(offer.amount > 0) || !(offer.price > 0)) return 0;
  const unit = offer.price / offer.amount;
  const normal = offer.prePrice > offer.price ? offer.prePrice / offer.amount : normalUnitPrice(data, ingredientId);
  if (!(normal > 0)) return 0;
  return Math.min(1, Math.max(0, 1 - unit / normal));
}

// The deepest discount among a dish's hero offers.
export function dishDepth(data, heroes) {
  return heroes.reduce((best, h) => Math.max(best, offerDepth(data, h.ingredientId, h.offer)), 0);
}

// ISO week keys ("2026-W44") for the `count` weeks before `week`.
export function previousWeeks(week, count) {
  const [year, w] = week.split('-W').map(Number);
  // Monday of ISO week 1 is the Monday on or before 4 January.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() || 7) - 1) + (w - 1) * 7);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() - 7 * (i + 1));
    return weekKeyOf(d);
  });
}

function weekKeyOf(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const n = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(n).padStart(2, '0')}`;
}

// Remember which dishes were planned in a week that just ended. Keeps the
// most recent HISTORY_WEEKS weeks.
export function archiveWeek(past, week, recipeIds) {
  if (!week || recipeIds.length === 0) return past;
  const weeks = { ...past.weeks, [week]: [...new Set(recipeIds)] };
  const keep = Object.keys(weeks).sort().slice(-HISTORY_WEEKS);
  return { ...past, weeks: Object.fromEntries(keep.map((k) => [k, weeks[k]])) };
}

// items: [{ recipe, heroes, price }] as built by the deck.
export function rankDeck(data, items, { week, past = { weeks: {} } } = {}) {
  const recent = new Set(
    week ? previousWeeks(week, ROTATION_WEEKS).flatMap((k) => past.weeks?.[k] ?? []) : []
  );
  return items
    .map((item) => {
      const depth = dishDepth(data, item.heroes);
      return {
        ...item,
        depth,
        score: item.price * (1 - DEPTH_WEIGHT * depth),
        resting: recent.has(item.recipe.id) && depth < COMEBACK_DEPTH
      };
    })
    .sort((a, b) =>
      (a.resting - b.resting) || (a.score - b.score) || a.recipe.title.localeCompare(b.recipe.title, 'da')
    );
}
