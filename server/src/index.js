import express from 'express';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';
import { refreshWeek, latestWeek, weekKey, weekPayload, IMAGE_DIR } from './week.js';

const here = dirname(fileURLToPath(import.meta.url));
// API_PORT, not PORT: dev tools often set PORT for the web server.
const PORT = Number(process.env.API_PORT ?? 8787);
// Prices are fetched at most once a day per source (polite towards the chains and
// Tjek); the hourly check below only triggers a refresh when that day has passed
// or the ISO week has changed. Offers that end are hidden by their own dates.
const REFRESH_HOURS = Number(process.env.REFRESH_HOURS ?? 24);
const db = openDb();
const app = express();

let refreshing = null;
function refresh() {
  refreshing ??= refreshWeek(db)
    .catch((err) => console.error('Opdatering fejlede:', err.message))
    .finally(() => { refreshing = null; });
  return refreshing;
}

function isStale(latest) {
  if (!latest || latest.week !== weekKey()) return true;
  return Date.now() - Date.parse(latest.refreshed_at) > REFRESH_HOURS * 3600_000;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/week', (_req, res) => {
  const latest = latestWeek(db);
  if (isStale(latest)) refresh();
  if (!latest) return res.status(202).json({ status: 'refreshing' });
  res.set('Cache-Control', 'no-store');
  res.json({ ...weekPayload(db, latest.week), refreshing: refreshing != null });
});

app.post('/api/refresh', async (_req, res) => {
  await refresh();
  res.json({ week: latestWeek(db)?.week ?? null });
});

app.use('/images', express.static(IMAGE_DIR, { maxAge: '7d' }));

// In production the built web app is served from here.
const webDist = join(here, '..', '..', 'web', 'dist');
if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^\/(?!api|images).*/, (_req, res) => res.sendFile(join(webDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`API kører på http://localhost:${PORT}`);
  if (isStale(latestWeek(db))) {
    console.log('Henter ugens tilbudsaviser …');
    refresh();
  }
  setInterval(() => isStale(latestWeek(db)) && refresh(), 3600_000).unref();
});
