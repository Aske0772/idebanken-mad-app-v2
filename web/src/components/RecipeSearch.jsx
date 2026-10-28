import { useMemo } from 'react';
import { DishArt, SearchField, Suggestions } from './ui.jsx';
import { Chevron } from './icons.jsx';
import { DIET_LABEL } from './SwipeView.jsx';
import { searchRecipes, onTilbud } from '../lib/search.js';
import { krSmall } from '../lib/format.js';

// All recipes, searchable by what's in them: type "laks" and get every dish with laks.
// For when you don't want to swipe and just need an idea.
export function RecipeSearch({ data, prefs, query, setQuery, onOpen }) {
  const results = useMemo(
    () => searchRecipes(data, query, { stores: prefs.stores, people: prefs.people, atHome: prefs.atHome }),
    [data, query, prefs.stores, prefs.people, prefs.atHome]
  );
  const suggestions = useMemo(() => onTilbud(data, prefs.stores), [data, prefs.stores]);
  const searching = query.trim() !== '';

  return (
    <div className="page">
      <header className="page-head">
        <h1>Opskrifter</h1>
        <span className="muted">{results.length} {results.length === 1 ? 'ret' : 'retter'}</span>
      </header>
      <SearchField value={query} onChange={setQuery} label="Søg i opskrifter" placeholder="Søg på en vare, fx laks" />

      {!searching && <Suggestions title="På tilbud i dine butikker" items={suggestions} onPick={setQuery} />}

      {searching && results.length === 0 ? (
        <div className="empty">
          <p>Ingen opskrifter med “{query.trim()}”.</p>
          <button type="button" className="secondary" onClick={() => setQuery('')}>Se alle opskrifter</button>
        </div>
      ) : (
        <ul className="week-list">
          {results.map(({ recipe, inTitle, matched, onOffer, price }) => (
            <li key={recipe.id}>
              <button type="button" className="week-item" onClick={() => onOpen(recipe)}>
                <DishArt recipe={recipe} className="week-bg" />
                <span className="week-shade" aria-hidden="true" />
                <span className="week-text">
                  <span className="week-title">{recipe.title}</span>
                  <span className="muted small">
                    {recipe.minutes} min · {DIET_LABEL[recipe.diet]}
                    {searching && !inTitle && matched.length > 0 && ` · med ${matched.slice(0, 2).join(' og ')}`}
                  </span>
                  {onOffer && <span className="recipe-tilbud">På tilbud</span>}
                </span>
                <span className="week-price">
                  {krSmall(price)}
                  <small>pr. portion</small>
                </span>
                <Chevron size={18} className="muted" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
