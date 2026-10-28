import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ingredientsFor, amountInUnit, matchOffer } from '../src/match.js';
import { INGREDIENTS } from '../src/ingredients.js';

// Real headings from this week's tilbudsaviser.
const cases = [
  ['Netto hakket oksekød 4-7% eller ØGO økologisk hakket oksekød 14-18%', ['hakket_okse']],
  ['Velsmag hakket dansk grise- og kalvekød 8-12%', ['hakket_grisekalv']],
  ['Røget bacon, hakket okse eller grise/kalvekød', ['hakket_okse', 'hakket_grisekalv', 'bacon']],
  ['Dansk kyllingebrystfilet', ['kyllingebryst']],
  ['Harvest Best bønner eller kikærter', ['kikaerter', 'bonner']],
  ['Lammefjordskartofler', ['kartofler']],
  ['Løg', ['loeg']],
  ['Cremefine madlavning eller piske', ['flode']],
  ['COMBINO Spaghetti', ['pasta']],
  ['Xtra! Jasminris', ['ris']],
  ['Spisemodne økologiske avocadoer', ['avocado']],
  ['Gammeldags oksegrydesteg af bov eller tykkam', ['oksekod_gryde']],
  ['Lakse- eller torskefars', ['fiskefars']],
  ['Navito vannameirejer', ['rejer']],
  ['REMA 1000 Danske rødspættefileter, tunsteaks, rå eller kogte vannameirejer', ['hvid_fisk', 'rejer']],
  ['Hokkaido', ['graeskar']],
  ['ØGO økologisk dansk hokkaido græskar', ['graeskar']],
  ['Økologiske danske hokkaido græskar eller spaghetti squash', ['graeskar']],
  ['ØGO økologiske danske rødbeder', ['rodbeder']],
  ['Næmt grønkål', ['groenkaal']],
  ['Danske æbler', ['aebler']],
  ['Fejø udvalgte æbler', ['aebler']],
  ['Økologiske bønner, linser eller kikærter', ['bonner', 'linser', 'kikaerter']],
  ['Urtekram økologiske belugalinser', ['gronne_linser']],
  ['Grydesteg af tykkam', ['oksekod_gryde']],
  ['Schulstad Det gode solsikkerugbrød', ['rugbrod']]
];

for (const [heading, expected] of cases) {
  test(`matches: ${heading}`, () => {
    assert.deepEqual(ingredientsFor(heading).sort(), expected.sort());
  });
}

const negatives = [
  'Coca-Cola, Fanta, Tuborg Squash eller Schweppes',
  'HARVEST BASKET Kartoffelrøsti',
  'Karolines Køkken risalamande',
  'PAMA Grødris',
  'Lays, Doritos eller Bugles chips',
  "MILA'S WORLD Vådfoder med kyllingefilet",
  'Sylte, blodpølse eller røget medister',
  'CHEF SELECT Baguetter med smør',
  'Egelykke paté med champignon/grønne peberkorn',
  'Samyang nudler',
  'Ris cuisine',
  'RiceUp! zero sugar risbar',
  'Halloween græskar',
  'Græskarhoved lanterne',
  'Pyntegræskar',
  'Mamone græskarkerner',
  'Irma æble- eller bærgløgg',
  'Urtekram økologisk æblecidereddike',
  'Næmt granatæblekerner',
  'Glaseret skinke med grønlangkål',
  'Coop spareribs eller pulled pork',
  'Frugtkiks æble&kanel',
  'RAHBEK INDBAGT FISK ELLER REJER',
  'Rødbeder u/sukker',
  'Kohberg Rugbrødsboller',
  'Rugbrødsblanding',
  'Grønlandske rejer, kold- eller varmrøget laks'
];

for (const heading of negatives) {
  test(`ignores: ${heading}`, () => {
    assert.deepEqual(ingredientsFor(heading), []);
  });
}

test('converts weight offers to pieces for piece-counted ingredients', () => {
  // 1 kg onions ≈ 10 onions at 100 g each
  assert.equal(amountInUnit({ unit: 'kg', amount: 1 }, INGREDIENTS.loeg), 10);
});

test('a garlic head counts as ten cloves', () => {
  assert.equal(amountInUnit({ unit: 'pcs', amount: 3 }, INGREDIENTS.hvidloeg), 30);
});

test('rejects offers with an absurd unit price', () => {
  const offer = { heading: 'Dansk kyllingebrystfilet', price: 400, quantity: { unit: 'kg', amount: 0.4 } };
  assert.deepEqual(matchOffer(offer), []);
});

test('drops a weight-priced offer with no printed size', () => {
  assert.deepEqual(matchOffer({ heading: 'Dansk kyllingebrystfilet', price: 25, quantity: null }), []);
});

test('small packs of meat are pålæg, not the raw ingredient', () => {
  const coldCuts = { heading: 'Kyllingebryst', price: 10, quantity: { unit: 'kg', amount: 0.08 } };
  assert.deepEqual(matchOffer(coldCuts, { shelf: true }), []);
  const fillet = { heading: 'Kyllingebrystfilet', price: 27.95, quantity: { unit: 'kg', amount: 0.28 } };
  assert.equal(matchOffer(fillet, { shelf: true })[0].ingredientId, 'kyllingebryst');
  // Bacon really is sold in 100 g packs.
  assert.equal(matchOffer({ heading: 'Brunchy bacon i skiver', price: 5, quantity: { unit: 'kg', amount: 0.1 } })[0].ingredientId, 'bacon');
});

test('shelf products are vetoed on their description too', () => {
  const p = { heading: 'Citron', description: '1000 GR. / CHEASY, YOGHURT', price: 21.95, quantity: { unit: 'kg', amount: 1 } };
  assert.deepEqual(matchOffer(p, { shelf: true }), []);
});

test('REMA shelf names are recognised', () => {
  assert.deepEqual(ingredientsFor('Hk. oksekød 8-12%'), ['hakket_okse']);
  assert.deepEqual(ingredientsFor('Hk. gris & kalv 8-12%'), ['hakket_grisekalv']);
  assert.deepEqual(ingredientsFor('Rød peber'), ['peberfrugt']);
  assert.deepEqual(ingredientsFor('Rapsolie'), ['olie']);
});

test('assumes one piece when a piece-priced offer has no size', () => {
  const [m] = matchOffer({ heading: 'Agurk', price: 7, quantity: null });
  assert.equal(m.ingredientId, 'agurk');
  assert.equal(m.assumed, true);
  assert.equal(m.amount, 1);
});
