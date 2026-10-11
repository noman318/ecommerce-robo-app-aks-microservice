import { useEffect, useId, useRef, useState } from 'react';
import { api } from '../api';
import type { LocationMatch } from '../types';

const MIN_CHARS = 3;
const DEBOUNCE_MS = 200;

interface Props {
  countryCode: string;
  disabled?: boolean;
  onSelect: (match: LocationMatch | null) => void;
}

/** Accessible combobox that queries /api/shipping/match as the user types. */
export default function LocationAutocomplete({ countryCode, disabled, onSelect }: Props) {
  const [term, setTerm] = useState('');
  const [matches, setMatches] = useState<LocationMatch[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const selectedName = useRef<string | null>(null);

  // reset when the country changes
  useEffect(() => {
    setTerm('');
    setMatches([]);
    setOpen(false);
    selectedName.current = null;
  }, [countryCode]);

  useEffect(() => {
    if (!countryCode || term.length < MIN_CHARS || term === selectedName.current) {
      setMatches([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      api
        .matchLocation(countryCode, term)
        .then((m) => {
          if (cancelled) return;
          setMatches(m);
          setActive(-1);
          setOpen(true);
        })
        .catch((e) => console.error('match', e));
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [countryCode, term]);

  const choose = (m: LocationMatch) => {
    selectedName.current = m.name;
    setTerm(m.name);
    setOpen(false);
    onSelect(m);
  };

  const showList = open && matches.length > 0;

  return (
    <div className="relative">
      <input
        id="location"
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        disabled={disabled}
        value={term}
        placeholder={disabled ? 'Select a country first' : `Start typing a town or city (${MIN_CHARS}+ letters)`}
        className="input"
        onChange={(e) => {
          setTerm(e.target.value);
          if (selectedName.current !== null) {
            selectedName.current = null;
            onSelect(null);
          }
        }}
        onFocus={() => matches.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % matches.length);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
          } else if (e.key === 'Enter' && active >= 0) {
            e.preventDefault();
            choose(matches[active]);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-2 max-h-64 w-full animate-fade-in overflow-auto rounded-xl bg-white p-1.5 text-sm shadow-pop ring-1 ring-zinc-950/10"
        >
          {matches.map((m, i) => (
            <li
              key={m.uuid}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(m);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer rounded-lg px-3 py-2 transition-colors ${i === active ? 'bg-brand-50 font-medium text-brand-700' : 'text-zinc-700'}`}
            >
              {m.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
