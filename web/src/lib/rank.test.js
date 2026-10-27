import { describe, it, expect } from 'vitest';
import { offerDepth, rankDeck, previousWeeks, archiveWeek, HISTORY_WEEKS } from './rank.js';

const data = {
  ingredients: {
    kylling: { normal: [400, 40] }, // 0,10 kr/g
    laks: { normal: [250, 50] }, // 0,20 kr/g
    ris: { normal: [1000, 18] }
  },
  offers: {
    // Shelf prices across chains: median 0,20 kr/g.
    laks: [
      { id: 's1', store: 'rema', price: 45, amount: 250, kind: 'hylde' },
      { id: 's2', store: 'lidl', price: 50, amount: 250, kind: 'hylde' },
      { id: 's3', store: 'x', price: 60, amount: 250, kind: 'hylde' }
    ]
  }
};

const item = (id, price, heroes = []) => ({ recipe: { id, title: id }, price, heroes });
const hero = (ingredientId, offer) => ({ ingredientId, offer });

describe('offerDepth', () => {
  it('uses the printed before-price when there is one', () => {
    expect(offerDepth(data, 'kylling', { price: 10, prePrice: 20, amount: 500 })).toBeCloseTo(0.5);
  });

  it('falls back to the median shelf price, then to our normal price', () => {
    expect(offerDepth(data, 'laks', { price: 30, amount: 250 })).toBeCloseTo(0.4);
    expect(offerDepth(data, 'kylling', { price: 30, amount: 400 })).toBeCloseTo(0.25);
  });

  it('is never below 0 or above 1', () => {
    expect(offerDepth(data, 'kylling', { price: 80, amount: 400 })).toBe(0);
    expect(offerDepth(data, 'kylling', { price: 0, amount: 400 })).toBe(0);
  });
});

describe('rankDeck', () => {
  it('a deep discount beats a slightly cheaper dish without one', () => {
    const deck = rankDeck(data, [
      item('billig', 18, [hero('kylling', { price: 38, amount: 400 })]), // 5 % off
      item('tilbud', 20, [hero('laks', { price: 25, amount: 250 })]) // 50 % off → scores 15
    ]);
    expect(deck.map((x) => x.recipe.id)).toEqual(['tilbud', 'billig']);
  });

  it('dishes cooked in the last two weeks go to the back', () => {
    const past = { weeks: { '2026-W43': ['karry'], '2026-W40': ['wok'] } };
    const deck = rankDeck(data, [
      item('karry', 10, [hero('kylling', { price: 36, amount: 400 })]),
      item('wok', 12, [hero('kylling', { price: 36, amount: 400 })]),
      item('risret', 15, [hero('kylling', { price: 36, amount: 400 })])
    ], { week: '2026-W44', past });
    // karry was planned last week; wok four weeks ago is fair game again.
    expect(deck.map((x) => x.recipe.id)).toEqual(['wok', 'risret', 'karry']);
  });

  it('a recently cooked dish comes back when its tilbud is great', () => {
    const past = { weeks: { '2026-W43': ['karry'] } };
    const deck = rankDeck(data, [
      item('karry', 10, [hero('kylling', { price: 10, prePrice: 40, amount: 400 })]),
      item('risret', 9, [hero('kylling', { price: 38, amount: 400 })])
    ], { week: '2026-W44', past });
    expect(deck[0].recipe.id).toBe('karry');
  });
});

describe('week history', () => {
  it('knows the weeks before, across a new year', () => {
    expect(previousWeeks('2026-W44', 2)).toEqual(['2026-W43', '2026-W42']);
    expect(previousWeeks('2027-W01', 2)).toEqual(['2026-W53', '2026-W52']);
  });

  it('keeps only the most recent weeks and skips empty plans', () => {
    let past = { weeks: {} };
    for (let w = 30; w < 40; w++) past = archiveWeek(past, `2026-W${w}`, [`ret-${w}`]);
    expect(Object.keys(past.weeks)).toHaveLength(HISTORY_WEEKS);
    expect(past.weeks['2026-W39']).toEqual(['ret-39']);
    expect(archiveWeek(past, '2026-W40', [])).toBe(past);
  });
});
