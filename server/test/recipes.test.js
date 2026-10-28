import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RECIPES } from '../src/recipes.js';
import { INGREDIENTS } from '../src/ingredients.js';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');

test('recipe ids are unique', () => {
  const ids = RECIPES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
});

for (const r of RECIPES) {
  test(`${r.id} is well-formed`, () => {
    for (const [id, qty] of r.ingredients) {
      assert.ok(INGREDIENTS[id], `unknown ingredient ${id}`);
      assert.ok(qty > 0, `${id} needs a positive quantity`);
    }
    const used = new Set(r.ingredients.map(([id]) => id));
    for (const h of r.hero) {
      assert.ok(used.has(h), `hero ${h} is not in the ingredient list`);
      assert.ok(!INGREDIENTS[h].staple, `hero ${h} cannot be a staple`);
      assert.ok(INGREDIENTS[h].match, `hero ${h} can never be matched to an offer`);
    }
    assert.ok(r.steps.length >= 3);
    assert.ok(['kod', 'fisk', 'vegetar'].includes(r.diet));
  });
}

test('every recipe has a photo and an image prompt', () => {
  const prompts = JSON.parse(readFileSync(join(DATA_DIR, 'image-prompts.json'), 'utf8')).dishes;
  for (const r of RECIPES) {
    assert.ok(prompts[r.id], `${r.id} has no image prompt`);
    assert.ok(existsSync(join(DATA_DIR, 'images', `${r.id}.webp`)), `${r.id} has no image`);
  }
});

test('vegetarian recipes contain no meat or fish', () => {
  for (const r of RECIPES.filter((x) => x.diet === 'vegetar')) {
    for (const [id] of r.ingredients) {
      assert.ok(!['kod', 'fisk', 'fiskepinde', 'tun'].includes(INGREDIENTS[id].cat) &&
        !['fiskepinde', 'tun'].includes(id), `${r.id} uses ${id}`);
    }
  }
});
