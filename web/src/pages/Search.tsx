import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { api } from '../api';
import { ProductImage, Spinner } from '../components/ui';
import { money } from '../format';
import type { Product } from '../types';

export default function Search() {
  const { text = '' } = useParams();
  const [results, setResults] = useState<Product[] | null>(null);

  useEffect(() => {
    let active = true;
    setResults(null);
    api
      .search(text)
      .then((r) => active && setResults(r))
      .catch((e) => {
        console.error('search', e);
        if (active) setResults([]);
      });
    return () => {
      active = false;
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Search results</h1>
        <p className="mt-1 text-sm text-slate-500">
          for <span className="font-medium text-slate-700">“{text}”</span>
        </p>
      </div>

      {results === null ? (
        <Spinner label="Searching…" />
      ) : results.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Sorry, nothing matches your search.</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <li key={item.sku}>
              <Link
                to={`/product/${item.sku}`}
                className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 p-4">
                  <ProductImage
                    sku={item.sku}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-slate-900">{item.name}</h2>
                    <span className="shrink-0 font-semibold text-brand-700 tabular-nums">{money(item.price)}</span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-sm text-slate-500">{item.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
