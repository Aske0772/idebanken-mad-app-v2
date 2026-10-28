import { describe, it, expect } from 'vitest';
import { normalize, searchRecipes, searchPrices, unitPrice, onTilbud } from './search.js';

const data = {
  ingredients: {
    laks: { name: 'laks', unit: 'g', cat: 'fisk', staple: false, normal: [400, 70] },
    flode: { name: 'fløde', unit: 'ml', cat: 'mejeri', staple: false, normal: [250, 12] },
    pasta: { name: 'pasta', unit: 'g', cat: 'kolonial', staple: false, normal: [500, 10] },
    salt: { name: 'salt', unit: 'g', cat: 'basis', staple: true, normal: [1000, 8] }
  },
  offers: {
    laks: [
      { id: 'n', store: 'netto', title: 'Laksefilet', price: 40, amount: 250, kind: 'tilbud' },
      { id: 'n2', store: 'netto', title: 'Lakseside', price: 120, amount: 1000, kind: 'tilbud' },
      { id: 'r', store: 'rema', title: 'Laks naturel', price: 45, amount: 250, kind: 'hylde' },
      { id: 'f', store: 'foetex', title: 'Røget laks', price: 30, amount: 100, kind: 'tilbud' }
    ],
    pasta: [{ id: 'p', store: 'netto', title: 'Penne', price: 10, amount: 500, kind: 'fast' }]
  },
  recipes: [
    {
      id: 'teriyaki', title: 'Laks teriyaki', blurb: 'Blank glaze', serves: 4, hero: ['laks'],
      ingredients: [{ id: 'laks', qty: 500 }, { id: 'salt', qty: 3 }]
    },
    {
      id: 'laksepasta', title: 'Pasta med fisk', blurb: 'Cremet', serves: 4, hero: ['pasta'],
      ingredients: [{ id: 'pasta', qty: 400 }, { id: 'laks', qty: 300 }, { id: 'flode', qty: 250 }]
    },
    {
      id: 'saltret', title: 'Penne', blurb: 'Enkel', serves: 4, hero: ['pasta'],
      ingredients: [{ id: 'pasta', qty: 400 }, { id: 'salt', qty: 3 }]
    }
  ]
};

describe('normalize', () => {
  it('drops accents but keeps æ, ø and å', () => {
    expect(normalize(' Crème Fraîche ')).toBe('creme fraiche');
    expect(normalize('Fløde Ål Æble')).toBe('fløde ål æble');
  });
});

describe('searchRecipes', () => {
  const opts = { stores: ['netto', 'rema'] };

  it('finds dishes by an ingredient, title hits first', () => {
    const ids = searchRecipes(data, 'laks', opts).map((r) => r.recipe.id);
    expect(ids).toEqual(['teriyaki', 'laksepasta']);
  });

  it('needs every word and ignores basisvarer', () => {
    expect(searchRecipes(data, 'pasta fløde', opts).map((r) => r.recipe.id)).toEqual(['laksepasta']);
    expect(searchRecipes(data, 'salt', opts)).toEqual([]);
  });

  it('lists all dishes for an empty query', () => {
    expect(searchRecipes(data, '  ', opts)).toHaveLength(3);
  });

  it('says which ingredients matched', () => {
    const [, pasta] = searchRecipes(data, 'laks', opts);
    expect(pasta.matched).toEqual(['laks']);
  });
});

describe('searchPrices', () => {
  const stores = ['netto', 'rema', 'foetex', 'lidl'];

  it('gives each store its best price per kg, cheapest first', () => {
    const [laks] = searchPrices(data, 'laks', { stores });
    expect(laks.rows.map((r) => [r.store, r.offer.id, r.per])).toEqual([
      ['netto', 'n2', 120],
      ['rema', 'r', 180],
      ['foetex', 'f', 300]
    ]);
    expect(laks.missing).toEqual(['lidl']);
  });

  it('matches product names when the ingredient name does not', () => {
    const [laks] = searchPrices(data, 'laksefilet', { stores });
    expect(laks.rows.map((r) => r.offer.id)).toEqual(['n']);
  });

  it('does not repeat a mixed offer under a second ingredient', () => {
    const mixed = { id: 'mix', store: 'foetex', title: 'Sej, laks eller rejer', price: 49, amount: 250, kind: 'tilbud' };
    const withMix = {
      ...data,
      ingredients: { ...data.ingredients, rejer: { name: 'rejer', unit: 'g', cat: 'fisk', staple: false, normal: [250, 40] } },
      offers: { ...data.offers, laks: [...data.offers.laks, mixed], rejer: [mixed] }
    };
    expect(searchPrices(withMix, 'laks', { stores }).map((r) => r.id)).toEqual(['laks']);
    expect(searchPrices(withMix, 'rejer', { stores }).map((r) => r.id)).toEqual(['rejer']);
  });

  it('only looks in the given stores', () => {
    const [laks] = searchPrices(data, 'laks', { stores: ['rema'] });
    expect(laks.rows.map((r) => r.store)).toEqual(['rema']);
    expect(searchPrices(data, 'fløde', { stores })).toEqual([]);
  });
});

describe('unitPrice and onTilbud', () => {
  it('prices per kg, litre or piece', () => {
    expect(unitPrice({ price: 25, amount: 500 }, { unit: 'g' })).toBe(50);
    expect(unitPrice({ price: 12, amount: 4 }, { unit: 'stk' })).toBe(3);
  });

  it('suggests only ingredients on avis tilbud in the stores', () => {
    expect(onTilbud(data, ['netto'])).toEqual([{ id: 'laks', name: 'laks' }]);
    expect(onTilbud(data, ['rema'])).toEqual([]);
  });
});
