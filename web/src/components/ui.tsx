import { useEffect, useState, type ReactNode } from 'react';
import { money } from '../format';
import type { Cart } from '../types';
import { CheckIcon, TruckIcon } from './icons';

export function Alert({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error'; children: ReactNode }) {
  const styles = {
    info: { box: 'bg-brand-50 text-brand-900 ring-brand-200', dot: 'bg-brand-600 text-white', mark: 'i' },
    success: { box: 'bg-emerald-50 text-emerald-900 ring-emerald-200', dot: 'bg-emerald-600 text-white', mark: '✓' },
    error: { box: 'bg-rose-50 text-rose-900 ring-rose-200', dot: 'bg-rose-600 text-white', mark: '!' },
  }[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex animate-fade-in items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${styles.box}`}
    >
      <span
        aria-hidden="true"
        className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${styles.dot}`}
      >
        {styles.mark}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** A message that clears itself after `ms` — replaces the AngularJS $timeout(clearMessage, 3000) pattern. */
export function useFlash(ms = 3000) {
  const [flash, setFlash] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), ms);
    return () => clearTimeout(t);
  }, [flash, ms]);
  return [flash, setFlash] as const;
}

export function ProductImage({ sku, alt, className }: { sku: string; alt: string; className?: string }) {
  return (
    <img
      src={`/images/${sku}.png`}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.endsWith('/images/placeholder.png')) img.src = '/images/placeholder.png';
      }}
    />
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-zinc-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-brand-600" />
      {label}
    </div>
  );
}

/** Centred placeholder for empty states. */
export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      {icon && (
        <span className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">{icon}</span>
      )}
      <h2 className="section-title">{title}</h2>
      {children}
    </div>
  );
}

/** Product line items. `renderQty` lets the cart page swap in an editable control. */
export function LineItems({ cart, renderQty }: { cart: Cart; renderQty?: (sku: string, qty: number) => ReactNode }) {
  return (
    <ul className="card divide-y divide-zinc-100">
      {cart.items.map((item) => (
        <li key={item.sku} className="flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
          {item.sku === 'SHIP' ? (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:h-20 sm:w-20">
              <TruckIcon className="h-7 w-7" />
            </span>
          ) : (
            <span className="tile flex h-16 w-16 shrink-0 items-center justify-center rounded-xl p-2 sm:h-20 sm:w-20">
              <ProductImage sku={item.sku} alt="" className="max-h-full max-w-full object-contain" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{item.name}</p>
            <p className="mt-0.5 text-sm text-zinc-500 tabular-nums">
              {item.sku === 'SHIP' ? 'Delivery' : `${money(item.price)} each`}
            </p>
            {renderQty && item.sku !== 'SHIP' && <div className="mt-3">{renderQty(item.sku, item.qty)}</div>}
            {!renderQty && item.sku !== 'SHIP' && <p className="mt-1 text-xs text-zinc-500">Qty {item.qty}</p>}
          </div>
          <p className="price self-start text-base">{money(item.subtotal)}</p>
        </li>
      ))}
    </ul>
  );
}

/** Tax + total, with an optional call to action underneath. */
export function Totals({ cart, children }: { cart: Cart; children?: ReactNode }) {
  const count = cart.items.reduce((n, i) => n + (i.sku === 'SHIP' ? 0 : i.qty), 0);
  return (
    <div className="card space-y-4 p-6">
      <h2 className="section-title">Order summary</h2>
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between text-zinc-600">
          <dt>Items</dt>
          <dd className="tabular-nums">{count}</dd>
        </div>
        <div className="flex justify-between text-zinc-600">
          <dt>Includes tax</dt>
          <dd className="tabular-nums">{money(cart.tax)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="price text-2xl">{money(cart.total)}</dd>
        </div>
      </dl>
      {children}
      <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
        <CheckIcon className="h-3.5 w-3.5" /> Prices in EUR, tax included
      </p>
    </div>
  );
}
