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
    <nav className="card p-3" aria-label="Categories">
      <h2 className="px-3 pt-2 pb-3 text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">Shop by category</h2>
      {categories === null && (
        <div className="space-y-2 px-3 pb-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-8" />
          ))}
        </div>
      )}
      {categories?.length === 0 && <p className="px-3 pb-2 text-sm text-zinc-400">Catalogue unavailable</p>}
      <ul className="space-y-0.5">
        {categories?.map((cat) => {
          const products = open[cat];
          return (
            <li key={cat}>
              <button
                type="button"
                onClick={() => toggle(cat)}
                aria-expanded={!!products}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  products ? 'bg-brand-50 text-brand-700' : 'text-zinc-700 hover:bg-zinc-100 hover:text-ink'
                }`}
              >
                {cat}
                <ChevronIcon
                  className={`h-4 w-4 transition-transform duration-200 ${products ? 'rotate-90 text-brand-500' : 'text-zinc-400'}`}
                />
              </button>
              {products && (
                <ul className="mt-1 mb-2 ml-4 animate-fade-in space-y-0.5 border-l-2 border-brand-100 pl-2">
                  {products.map((p) => (
                    <li key={p.sku}>
                      <NavLink
                        to={`/product/${p.sku}`}
                        className={({ isActive }) =>
                          `block rounded-lg px-3 py-1.5 text-sm transition ${
                            isActive
                              ? 'bg-ink font-medium text-white'
                              : 'text-zinc-600 hover:bg-zinc-100 hover:text-ink'
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
