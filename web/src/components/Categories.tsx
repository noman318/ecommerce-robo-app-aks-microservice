import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { api } from '../api';
import type { Product } from '../types';
import { ChevronIcon } from './icons';

export default function Categories() {
  const [categories, setCategories] = useState<string[] | null>(null);
  const [open, setOpen] = useState<Record<string, Product[] | undefined>>({});

  useEffect(() => {
    api
      .categories()
      .then(setCategories)
      .catch((e) => {
        console.error('categories', e);
        setCategories([]);
      });
  }, []);

  const toggle = (cat: string) => {
    if (open[cat]) {
      setOpen((o) => ({ ...o, [cat]: undefined }));
      return;
    }
    api
      .productsByCategory(cat)
      .then((products) => setOpen((o) => ({ ...o, [cat]: products })))
      .catch((e) => console.error('products', e));
  };

  return (
    <nav className="card p-4" aria-label="Categories">
      <h2 className="mb-3 px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Categories</h2>
      {categories === null && <p className="px-2 text-sm text-slate-400">Loading…</p>}
      {categories?.length === 0 && <p className="px-2 text-sm text-slate-400">Catalogue unavailable</p>}
      <ul className="space-y-1">
        {categories?.map((cat) => {
          const products = open[cat];
          return (
            <li key={cat}>
              <button
                type="button"
                onClick={() => toggle(cat)}
                aria-expanded={!!products}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {cat}
                <ChevronIcon className={`h-4 w-4 text-slate-400 transition-transform ${products ? 'rotate-90' : ''}`} />
              </button>
              {products && (
                <ul className="mt-1 mb-2 ml-2 space-y-0.5 border-l border-slate-200 pl-3">
                  {products.map((p) => (
                    <li key={p.sku}>
                      <NavLink
                        to={`/product/${p.sku}`}
                        className={({ isActive }) =>
                          `block rounded-md px-2 py-1.5 text-sm transition ${
                            isActive
                              ? 'bg-brand-50 font-medium text-brand-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`
                        }
                      >
                        {p.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
