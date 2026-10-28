import { useMemo, useState } from 'react';
import { SearchField, Suggestions } from './ui.jsx';
import { searchPrices, onTilbud, unitLabel } from '../lib/search.js';
import { kr, krSmall, packSize, capitalize, sourceParts, updatedLabel } from '../lib/format.js';

// Type a product and see what it costs in each store, cheapest per kg first.
export function PriceSearch({ data, prefs, query, setQuery, onRecipes }) {
  const [scope, setScope] = useState('alle');
  const storesById = useMemo(() => Object.fromEntries(data.stores.map((s) => [s.id, s])), [data]);
  const stores = scope === 'mine' ? prefs.stores : data.stores.map((s) => s.id);
  const results = useMemo(() => searchPrices(data, query, { stores }), [data, query, stores.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const suggestions = useMemo(() => onTilbud(data, data.stores.map((s) => s.id)), [data]);
  const recipeCount = (id) => data.recipes.filter((r) => r.ingredients.some((i) => i.id === id)).length;
  const searching = query.trim() !== '';

  return (
    <div className="page">
      <header className="page-head">
        <h1>Priser</h1>
      </header>
      <SearchField value={query} onChange={setQuery} label="Søg efter en vare" placeholder="Hvad koster … fx laks" />
      <div className="seg-light" role="group" aria-label="Butikker">
        <button type="button" className={scope === 'alle' ? 'is-on' : ''} aria-pressed={scope === 'alle'} onClick={() => setScope('alle')}>
          Alle butikker
        </button>
        <button type="button" className={scope === 'mine' ? 'is-on' : ''} aria-pressed={scope === 'mine'} onClick={() => setScope('mine')}>
          Mine butikker
        </button>
      </div>

      {!searching && <Suggestions title="På tilbud denne uge" items={suggestions} onPick={setQuery} />}

      {searching && results.length === 0 && (
        <div className="empty">
          <p>Ingen priser på “{query.trim()}” {scope === 'mine' ? 'i dine butikker' : 'denne uge'}.</p>
          <p className="small">Søg på en råvare som laks, kylling, løg eller mælk.</p>
        </div>
      )}

      {results.map(({ id, ing, rows, missing }) => {
        const unit = unitLabel(ing);
        const recipes = recipeCount(id);
        return (
          <section key={id} className="shop-group" aria-label={capitalize(ing.name)}>
            <h2 className="shop-group-title">
              <span>{ing.name}</span>
              <span>{rows.length} {rows.length === 1 ? 'butik' : 'butikker'}</span>
            </h2>
            <ul className="shop-items">
              {rows.map(({ store, offer, per }, n) => {
                const { note } = sourceParts({ kind: offer.kind ?? 'tilbud', offer }, storesById);
                return (
                  <li key={store} className={`price-row ${n === 0 && rows.length > 1 ? 'is-best' : ''}`}>
                    <span className="shop-text">
                      <span className="shop-name">
                        {storesById[store]?.name ?? store}
                        {n === 0 && rows.length > 1 && <span className="price-best">Billigst</span>}
                      </span>
                      <span className="shop-product">{offer.title}</span>
                      <span className={`shop-kind ${offer.kind ?? 'tilbud'}`}>
                        {packSize(offer.amount, ing)}{offer.assumed ? ' (anslået)' : ''} · {note}
                      </span>
                    </span>
                    <span className="price-figures">
                      <span className="shop-price">{kr(offer.price)}</span>
                      {offer.prePrice > offer.price && <s className="price-before">{kr(offer.prePrice)}</s>}
                      <span className="price-unit">{krSmall(per)}/{unit}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {missing.length > 0 && (
              <p className="shop-group-hint">
                {missing.length <= 3
                  ? `Ingen pris fra ${missing.map((s) => storesById[s]?.name ?? s).join(', ')}.`
                  : `Ingen pris denne uge i ${missing.length} andre butikker.`}
              </p>
            )}
            {recipes > 0 && (
              <button type="button" className="pill price-recipes" onClick={() => onRecipes(ing.name)}>
                Se {recipes} {recipes === 1 ? 'opskrift' : 'opskrifter'} med {ing.name}
              </button>
            )}
          </section>
        );
      })}

      <p className="summary-fresh center">Priser opdateret {updatedLabel(data.refreshedAt)}. Kun varer, der bruges i opskrifterne, er med.</p>
    </div>
  );
}
