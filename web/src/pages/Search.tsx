import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { api } from '../api';
import { ArrowRightIcon, SearchIcon } from '../components/icons';
import { EmptyState, ProductImage } from '../components/ui';
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Search results</p>
          <h1 className="page-title mt-2">“{text}”</h1>
        </div>
        {results && results.length > 0 && (
          <p className="text-sm text-zinc-500">
            {results.length} robot{results.length === 1 ? '' : 's'} found
          </p>
        )}
      </div>

      {results === null ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Searching">
          {[0, 1, 2].map((i) => (
            <li key={i} className="card overflow-hidden p-3">
              <div className="skeleton aspect-square rounded-xl" />
              <div className="space-y-2 p-2 pt-4">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-4/5" />
              </div>
            </li>
          ))}
        </ul>
      ) : results.length === 0 ? (
        <EmptyState icon={<SearchIcon className="h-6 w-6" />} title="No robots match your search">
          <p className="max-w-sm text-sm text-zinc-500">Check the spelling, or try a broader term or a category.</p>
        </EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <li key={item.sku}>
              <Link to={`/product/${item.sku}`} className="card card-hover group flex h-full flex-col overflow-hidden p-3">
                <div className="tile relative flex aspect-square items-center justify-center overflow-hidden rounded-xl p-6">
                  <ProductImage
                    sku={item.sku}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain drop-shadow-md transition duration-500 group-hover:scale-110"
                  />
                  {item.instock <= 0 && (
                    <span className="badge absolute top-3 left-3 bg-white/90 text-zinc-600 ring-1 ring-zinc-200 backdrop-blur">
                      Sold out
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-ink">{item.name}</h2>
                    <span className="price shrink-0">{money(item.price)}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600">
                    View details
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
