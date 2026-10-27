import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchWeek } from './lib/api.js';
import { usePersistent } from './lib/persist.js';
import { shoppingList } from './lib/pricing.js';
import { archiveWeek } from './lib/rank.js';
import { Onboarding } from './components/Onboarding.jsx';
import { SwipeView } from './components/SwipeView.jsx';
import { DishDetail } from './components/DishDetail.jsx';
import { WeekView } from './components/WeekView.jsx';
import { ListView } from './components/ListView.jsx';
import { StorePicker } from './components/StorePicker.jsx';
import { Sheet, Stepper } from './components/ui.jsx';
import { Cards, Calendar, List } from './components/icons.jsx';

const PREFS = { onboarded: false, stores: [], people: 2, diet: 'alle', atHome: [], saved: [] };
// Weekly state is tagged with the ISO week and starts fresh when the avis changes.
const WEEK = { week: null, plan: [], seen: [], checked: [] };
// Dishes planned in earlier weeks, so the deck can rest them for a while. Stays on the phone.
const PAST = { weeks: {} };

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [prefs, setPrefs] = usePersistent('mad.prefs', PREFS);
  const [state, setState] = usePersistent('mad.week', WEEK);
  const [past, setPast] = usePersistent('mad.history', PAST);
  const [tab, setTab] = useState('swipe');
  const [sheet, setSheet] = useState(null); // { recipe, item?, mode, fromSwipe? }
  const [storesOpen, setStoresOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let fetchedAt = 0;
    const load = () => {
      fetchedAt = Date.now();
      return fetchWeek({ onWaiting: () => setWaiting(true) }).then(setData);
    };
    load().catch((e) => setError(e.message));

    // Keep prices current: refetch when the app comes back into view or every 15 min.
    // A failed background refresh keeps the prices already shown.
    const STALE_MS = 15 * 60_000;
    const refetchIfStale = () => {
      if (document.visibilityState === 'visible' && Date.now() - fetchedAt > STALE_MS) load().catch(() => {});
    };
    document.addEventListener('visibilitychange', refetchIfStale);
    const timer = setInterval(refetchIfStale, STALE_MS);
    return () => {
      document.removeEventListener('visibilitychange', refetchIfStale);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!data || state.week === data.week) return;
    // A new avis week: remember what was planned before starting fresh.
    setPast((p) => archiveWeek(p, state.week, state.plan.map((i) => i.recipeId)));
    setState({ ...WEEK, week: data.week });
  }, [data, state.week, state.plan, setState, setPast]);

  const list = useMemo(
    () => (data ? shoppingList(data, state.plan, { stores: prefs.stores, atHome: prefs.atHome }) : null),
    [data, state.plan, prefs.stores, prefs.atHome]
  );

  const markSeen = (id) => setState((s) => ({ ...s, seen: [...s.seen, id] }));
  const unSee = (id) => setState((s) => ({ ...s, seen: s.seen.filter((x) => x !== id) }));

  const onSkip = (recipe) => {
    markSeen(recipe.id);
    setHistory((h) => [...h, recipe.id]);
  };
  const onLike = (recipe) => {
    markSeen(recipe.id);
    setSheet({ recipe, mode: 'add', fromSwipe: true });
  };
  const onUndo = () => {
    const last = history.at(-1);
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    unSee(last);
  };

  const closeSheet = useCallback(() => {
    // Closing after a right swipe without adding puts the card back on top.
    if (sheet?.fromSwipe) unSee(sheet.recipe.id);
    setSheet(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const confirm = ({ days, people, staples }) => {
    const { recipe, item } = sheet;
    setState((s) => {
      const plan = item
        ? s.plan.map((p) => (p.id === item.id ? { ...p, days, people, staples } : p))
        : [...s.plan, { id: crypto.randomUUID(), recipeId: recipe.id, days, people, staples }];
      const seen = s.seen.includes(recipe.id) ? s.seen : [...s.seen, recipe.id];
      return { ...s, plan, seen };
    });
    setSheet(null);
  };

  // The new dish takes the old one's place, days and people; the old one goes back in the deck.
  const replace = (old, { staples }) => {
    const { recipe } = sheet;
    setState((s) => {
      const plan = s.plan.map((p) => (p.id === old.id ? { ...p, id: crypto.randomUUID(), recipeId: recipe.id, staples } : p));
      const seen = s.seen.filter((x) => x !== old.recipeId);
      return { ...s, plan, seen: seen.includes(recipe.id) ? seen : [...seen, recipe.id] };
    });
    setSheet(null);
  };

  const remove = () => {
    const { item, recipe } = sheet;
    setState((s) => ({ ...s, plan: s.plan.filter((p) => p.id !== item.id), seen: s.seen.filter((x) => x !== recipe.id) }));
    setSheet(null);
  };

  const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  if (error) {
    return (
      <div className="center-screen">
        <p className="deck-empty-title">Kunne ikke hente ugens tilbud</p>
        <p className="muted">{error}</p>
        <button type="button" className="primary" onClick={() => location.reload()}>Prøv igen</button>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="center-screen">
        <div className="loader" aria-hidden="true" />
        <p className="muted">{waiting ? 'Henter ugens tilbudsaviser … første gang tager det et minut' : 'Henter ugens tilbud …'}</p>
      </div>
    );
  }
  if (!prefs.onboarded) {
    return <Onboarding data={data} onDone={({ stores, people }) => setPrefs((p) => ({ ...p, stores, people, onboarded: true }))} />;
  }

  const days = state.plan.reduce((sum, i) => sum + i.days, 0);

  return (
    <div className="app">
      <main className="main">
        {tab === 'swipe' && (
          <SwipeView
            data={data} prefs={prefs} setPrefs={setPrefs} seen={state.seen} past={past}
            onSkip={onSkip} onLike={onLike} onUndo={onUndo} canUndo={history.length > 0}
            onOpen={(recipe) => setSheet({ recipe, mode: 'add' })}
            onStores={() => setStoresOpen(true)}
            onReset={() => setState((s) => ({ ...s, seen: s.seen.filter((id) => s.plan.some((p) => p.recipeId === id)) }))}
          />
        )}
        {tab === 'week' && (
          <WeekView
            data={data} plan={state.plan} prefs={prefs} list={list}
            onOpen={(recipe, item) => setSheet({ recipe, item, mode: 'edit' })}
            onSwipe={() => setTab('swipe')}
          />
        )}
        {tab === 'list' && (
          <ListView
            data={data} list={list} checked={state.checked}
            onCheck={(id) => setState((s) => ({ ...s, checked: toggleIn(s.checked, id) }))}
            onAtHome={(id) => setPrefs((p) => ({ ...p, atHome: [...p.atHome, id] }))}
            onBackHome={(id) => setPrefs((p) => ({ ...p, atHome: p.atHome.filter((x) => x !== id) }))}
          />
        )}
      </main>

      <nav className="tabbar" aria-label="Hovedmenu">
        <TabButton id="swipe" tab={tab} setTab={setTab} icon={<Cards />} label="Swipe" />
        <TabButton id="week" tab={tab} setTab={setTab} icon={<Calendar />} label="Uge" badge={days || null} />
        <TabButton id="list" tab={tab} setTab={setTab} icon={<List />} label="Indkøb" />
      </nav>

      {sheet && (
        <DishDetail
          key={sheet.recipe.id + (sheet.item?.id ?? '')}
          data={data} recipe={sheet.recipe} item={sheet.item} mode={sheet.mode} prefs={prefs} plan={state.plan}
          saved={prefs.saved.includes(sheet.recipe.id)}
          onToggleSave={() => setPrefs((p) => ({ ...p, saved: toggleIn(p.saved, sheet.recipe.id) }))}
          onConfirm={confirm} onReplace={replace} onRemove={remove} onClose={closeSheet}
        />
      )}

      <Sheet open={storesOpen} onClose={() => setStoresOpen(false)} label="Butikker">
        <h2 className="sheet-title">Hvor handler du?</h2>
        <StorePicker
          stores={data.stores} selected={prefs.stores}
          onChange={(stores) => stores.length && setPrefs((p) => ({ ...p, stores }))}
        />
        <Stepper
          label="Personer som standard" value={prefs.people}
          onChange={(people) => setPrefs((p) => ({ ...p, people }))}
        />
        <p className="muted small">Tilbud fra uge {data.week.split('-W')[1]} · {data.stores.reduce((n, s) => n + s.offerCount, 0)} madvarer på tilbud</p>
        <button type="button" className="primary wide" onClick={() => setStoresOpen(false)}>Færdig</button>
      </Sheet>
    </div>
  );
}

function TabButton({ id, tab, setTab, icon, label, badge }) {
  return (
    <button
      type="button" className={`tab ${tab === id ? 'is-on' : ''}`}
      aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}
    >
      <span className="tab-icon">{icon}{badge ? <span className="badge">{badge}</span> : null}</span>
      <span className="tab-label">{label}</span>
    </button>
  );
}
