import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RECIPES } from './recipes.js';

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(here, '..', 'data');

export function openDb(file = process.env.DB_FILE ?? join(DATA_DIR, 'mad.db')) {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY, slug TEXT, name TEXT, color TEXT
    );
    CREATE TABLE IF NOT EXISTS weeks (
      week TEXT PRIMARY KEY, refreshed_at TEXT, offer_count INTEGER, errors TEXT
    );
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT, week TEXT, store_id TEXT, heading TEXT, description TEXT,
      price REAL, pre_price REAL, image TEXT, run_from TEXT, run_till TEXT,
      PRIMARY KEY (id, week)
    );
    CREATE TABLE IF NOT EXISTS offer_matches (
      offer_id TEXT, week TEXT, ingredient_id TEXT, amount REAL, assumed INTEGER,
      PRIMARY KEY (offer_id, week, ingredient_id)
    );
    CREATE INDEX IF NOT EXISTS offer_matches_week ON offer_matches (week, ingredient_id);
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY, title TEXT, blurb TEXT, minutes INTEGER, diet TEXT,
      serves INTEGER, emoji TEXT, hue INTEGER, image TEXT, data TEXT
    );
    CREATE TABLE IF NOT EXISTS source_runs (
      source TEXT PRIMARY KEY, ran_at TEXT, ok INTEGER, note TEXT
    );
    CREATE TABLE IF NOT EXISTS week_recipes (
      week TEXT, recipe_id TEXT, hero_offers TEXT, store_ids TEXT,
      PRIMARY KEY (week, recipe_id)
    );
  `);
  // kind: 'tilbud' (this week's avis), 'fast' (long-running catalog price), 'hylde' (shelf price)
  if (!db.prepare('PRAGMA table_info(offers)').all().some((c) => c.name === 'kind')) {
    db.exec("ALTER TABLE offers ADD COLUMN kind TEXT NOT NULL DEFAULT 'tilbud'");
  }
  seedRecipes(db);
  return db;
}

// recipes.js is the source of truth; mirror it into the db on every start.
// The image column is kept when already set so photos added later survive.
function seedRecipes(db) {
  const upsert = db.prepare(`
    INSERT INTO recipes (id, title, blurb, minutes, diet, serves, emoji, hue, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET title=excluded.title, blurb=excluded.blurb,
      minutes=excluded.minutes, diet=excluded.diet, serves=excluded.serves,
      emoji=excluded.emoji, hue=excluded.hue, data=excluded.data
  `);
  for (const r of RECIPES) {
    const data = JSON.stringify({ hero: r.hero, ingredients: r.ingredients, steps: r.steps });
    upsert.run(r.id, r.title, r.blurb, r.minutes, r.diet, r.serves, r.emoji, r.hue, data);
  }
}
