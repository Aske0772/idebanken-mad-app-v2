import { useEffect, useMemo, useRef, useState } from 'react';
import { DishArt } from './ui.jsx';
import { X, Plus, Undo, Store } from './icons.jsx';
import { heroOffers, portionPrice } from '../lib/pricing.js';
import { rankDeck } from '../lib/rank.js';
import { krSmall } from '../lib/format.js';

const FILTERS = [
  { id: 'alle', label: 'Alle' },
  { id: 'kod', label: 'Kød' },
  { id: 'fisk', label: 'Fisk' },
  { id: 'vegetar', label: 'Vegetar' },
  { id: 'hurtig', label: 'Hurtig' },
  { id: 'gemte', label: 'Gemte' }
];

export const DIET_LABEL = { kod: 'Kød', fisk: 'Fisk', vegetar: 'Vegetar' };

const passes = (filter, recipe, saved) => {
  if (filter === 'hurtig') return recipe.minutes <= 30;
  if (filter === 'gemte') return saved.includes(recipe.id);
  return filter === 'alle' || recipe.diet === filter;
};

export function SwipeView({ data, prefs, setPrefs, seen, past, onSkip, onLike, onUndo, canUndo, onOpen, onStores, onReset }) {
  const storesById = useMemo(() => Object.fromEntries(data.stores.map((s) => [s.id, s])), [data]);
  const filter = FILTERS.some((f) => f.id === prefs.diet) ? prefs.diet : 'alle';
  const saved = prefs.saved ?? [];

  // This week's deck: dishes with a hero ingredient on offer in the chosen stores,
  // ranked by price and discount, with dishes from the last weeks resting at the
  // back (lib/rank.js). Saved dishes show up under "Gemte" even without an offer,
  // cheapest first.
  const deck = useMemo(() => {
    const items = data.recipes
      .filter((r) => !seen.includes(r.id) && passes(filter, r, saved))
      .map((r) => ({
        recipe: r,
        heroes: heroOffers(data, r, prefs.stores),
        price: portionPrice(data, r, prefs.stores, prefs.people, prefs.atHome)
      }));
    if (filter === 'gemte') return items.sort((a, b) => a.price - b.price);
    return rankDeck(data, items.filter((x) => x.heroes.length > 0), { week: data.week, past });
  }, [data, prefs.stores, prefs.people, prefs.atHome, filter, saved, seen, past]);

  const [fling, setFling] = useState(null);
  const top = deck[0];

  useEffect(() => {
    const onKey = (e) => {
      if (!top || document.querySelector('[role="dialog"]')) return;
      if (e.key === 'ArrowLeft') setFling({ id: top.recipe.id, dir: -1 });
      if (e.key === 'ArrowRight') setFling({ id: top.recipe.id, dir: 1 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [top]);

  const done = (recipe, dir) => {
    setFling(null);
    if (dir > 0) onLike(recipe);
    else onSkip(recipe);
  };

  return (
    <div className="swipe-view">
      <header className="topbar">
        <div className="brand">Mæt</div>
        <button type="button" className="pill" onClick={onStores}>
          <Store size={18} />
          {prefs.stores.length === 1 ? storesById[prefs.stores[0]]?.name : `${prefs.stores.length} butikker`}
        </button>
      </header>

      <nav className="tabs" aria-label="Filtre">
        {FILTERS.map((f) => (
          <button
            key={f.id} type="button" className={`tab-link ${filter === f.id ? 'is-on' : ''}`}
            aria-pressed={filter === f.id} onClick={() => setPrefs((p) => ({ ...p, diet: f.id }))}
          >
            {f.label}
          </button>
        ))}
      </nav>

      <div className="deck">
        {deck.length === 0 && (
          <div className="deck-empty">
            <p className="deck-empty-title">{filter === 'gemte' && saved.length === 0 ? 'Ingen gemte retter endnu' : 'Det var ugens retter'}</p>
            <p className="muted">
              {filter === 'gemte' && saved.length === 0
                ? 'Tryk på hjertet i en ret for at gemme den her.'
                : 'Skift butikker eller filtre for at se flere.'}
            </p>
            {seen.length > 0 && (
              <button type="button" className="secondary" onClick={onReset}>Se de overspringte igen</button>
            )}
          </div>
        )}
        {deck.slice(0, 3).reverse().map((item) => {
          const depth = deck.indexOf(item);
          return (
            <SwipeCard
              key={item.recipe.id}
              title={item.recipe.title}
              depth={depth}
              fling={fling?.id === item.recipe.id ? fling.dir : 0}
              onSwiped={(dir) => done(item.recipe, dir)}
              onTap={() => onOpen(item.recipe)}
            >
              <DishArt recipe={item.recipe} className="card-photo" />
              <div className="card-shade" aria-hidden="true" />
              <div className="card-top">
                <h2 className="card-title">{item.recipe.title}</h2>
                <p className="card-sub">{item.recipe.minutes} min · {DIET_LABEL[item.recipe.diet]}</p>
              </div>
              <div className="card-bottom">
                <div className="card-price">
                  {krSmall(item.price)}<small>pr. portion</small>
                </div>
                <div className="card-offers">
                  {item.heroes.length === 0 && <span className="glass-chip">Ikke på tilbud denne uge</span>}
                  {uniqueHeroes(item.heroes).slice(0, 2).map(({ ingredientId, offer }) => (
                    <span className="glass-chip" key={ingredientId}>
                      {data.ingredients[ingredientId].name} {krSmall(offer.price)} · {storesById[offer.store]?.name}
                    </span>
                  ))}
                </div>
              </div>
            </SwipeCard>
          );
        })}
      </div>

      <div className="swipe-actions">
        <button type="button" className="round big nope" aria-label="Spring over" disabled={!top}
          onClick={() => top && setFling({ id: top.recipe.id, dir: -1 })}>
          <X size={28} />
        </button>
        <button type="button" className="round" aria-label="Fortryd" disabled={!canUndo} onClick={onUndo}>
          <Undo size={20} />
        </button>
        <button type="button" className="round big like" aria-label="Vil have" disabled={!top}
          onClick={() => top && setFling({ id: top.recipe.id, dir: 1 })}>
          <Plus size={30} />
        </button>
      </div>
    </div>
  );
}

// Cheapest offer per hero ingredient.
function uniqueHeroes(heroes) {
  const best = new Map();
  for (const h of heroes) {
    const cur = best.get(h.ingredientId);
    if (!cur || h.offer.price < cur.offer.price) best.set(h.ingredientId, h);
  }
  return [...best.values()];
}

const THRESHOLD = 110;

function SwipeCard({ children, title, depth, fling, onSwiped, onTap }) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(0);
  const start = useRef(null);
  // pointerup can fire before React re-renders a fast flick, so read the live offset from a ref.
  const offset = useRef({ x: 0, y: 0 });
  const isTop = depth === 0;

  const leave = (dir) => {
    setLeaving(dir);
    setTimeout(() => onSwiped(dir), 220);
  };

  useEffect(() => {
    if (fling && isTop) leave(fling);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fling]);

  const onPointerDown = (e) => {
    if (!isTop || leaving) return;
    start.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    offset.current = { x: 0, y: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!start.current) return;
    offset.current = { x: e.clientX - start.current.x, y: e.clientY - start.current.y };
    setDrag(offset.current);
  };
  const onPointerUp = (e) => {
    if (!start.current) return;
    if (e.type === 'pointerup') {
      offset.current = { x: e.clientX - start.current.x, y: e.clientY - start.current.y };
    }
    const { x: dx, y: dy } = offset.current;
    const velocity = dx / Math.max(performance.now() - start.current.t, 1);
    start.current = null;
    if (Math.abs(dx) > THRESHOLD || (Math.abs(dx) > 30 && Math.abs(velocity) > 0.7)) {
      setDrag(offset.current);
      leave(dx > 0 ? 1 : -1);
    } else {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) onTap();
      setDrag({ x: 0, y: 0 });
    }
  };

  const x = leaving ? leaving * window.innerWidth * 1.2 : drag.x;
  const rotate = x / 18;
  const style = isTop
    ? { transform: `translate(${x}px, ${leaving ? drag.y : drag.y * 0.3}px) rotate(${rotate}deg)` }
    : { transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.04})` };
  const dragging = start.current != null;
  const like = Math.max(0, Math.min(1, x / THRESHOLD));
  const nope = Math.max(0, Math.min(1, -x / THRESHOLD));

  return (
    <div
      className={`card ${isTop ? 'is-top' : ''} ${dragging ? 'is-dragging' : ''}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // Tap opens the dish; on a keyboard the focused top card opens with Enter.
      role={isTop ? 'button' : undefined}
      tabIndex={isTop ? 0 : -1}
      aria-label={isTop ? `${title} – se ingredienser og opskrift` : undefined}
      onKeyDown={(e) => isTop && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onTap())}
      aria-hidden={!isTop}
      inert={isTop ? undefined : ''}
    >
      {children}
      {isTop && (
        <>
          <span className="stamp stamp--like" style={{ opacity: like }}>JA TAK</span>
          <span className="stamp stamp--nope" style={{ opacity: nope }}>NÆSTE</span>
        </>
      )}
    </div>
  );
}
