import { useEffect } from 'react';
import { Minus, Plus, Search, X } from './icons.jsx';

export function SearchField({ value, onChange, placeholder, label }) {
  return (
    <div className="search">
      <Search size={20} className="search-icon" />
      <input
        type="search" className="search-input" value={value} placeholder={placeholder} aria-label={label}
        enterKeyHint="search" autoComplete="off" autoCorrect="off" spellCheck="false"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Ryd søgningen" onClick={() => onChange('')}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// Ingredient suggestions under an empty search field.
export function Suggestions({ title, items, onPick }) {
  if (items.length === 0) return null;
  return (
    <section className="suggest" aria-label={title}>
      <h2 className="shop-group-title"><span>{title}</span></h2>
      <ul className="shop-home-list">
        {items.map((i) => (
          <li key={i.id}>
            <button type="button" className="shop-pill" onClick={() => onPick(i.name)}>{i.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Sheet({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet" role="dialog" aria-modal="true" aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}

export function Stepper({ label, value, min = 1, max = 12, onChange, unit }) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button
          type="button" className="round" aria-label={`Færre ${label.toLowerCase()}`}
          disabled={value <= min} onClick={() => onChange(value - 1)}
        >
          <Minus size={18} />
        </button>
        <span className="stepper-value" aria-live="polite">
          {value}
          {unit && <small> {unit(value)}</small>}
        </span>
        <button
          type="button" className="round" aria-label={`Flere ${label.toLowerCase()}`}
          disabled={value >= max} onClick={() => onChange(value + 1)}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

// Photo when we have one, otherwise a generated plate in the dish's own colour.
export function DishArt({ recipe, className = '' }) {
  if (recipe.image) {
    return <img className={`dish-art ${className}`} src={recipe.image} alt="" draggable="false" />;
  }
  const h = recipe.hue;
  return (
    <div
      className={`dish-art dish-art--gen ${className}`}
      style={{ '--h1': `${h}`, '--h2': `${(h + 28) % 360}` }}
      aria-hidden="true"
    >
      <span className="dish-emoji">{recipe.emoji}</span>
    </div>
  );
}
