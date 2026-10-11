import { useEffect, useState, type ReactNode } from 'react';
import { money } from '../format';
import type { Cart } from '../types';

export function Alert({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error'; children: ReactNode }) {
  const styles = {
    info: 'border-brand-200 bg-brand-50 text-brand-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-rose-200 bg-rose-50 text-rose-800',
  }[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
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
    <div className="flex items-center gap-3 py-12 text-sm text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      {label}
    </div>
  );
}

/** Line items + tax + total. `renderQty` lets the cart page swap in an editable control. */
export function OrderSummary({ cart, renderQty }: { cart: Cart; renderQty?: (sku: string, qty: number) => ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="w-28 px-4 py-3 text-center">Qty</th>
            <th className="w-32 px-4 py-3 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cart.items.map((item) => (
            <tr key={item.sku}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {item.sku !== 'SHIP' && (
                    <ProductImage sku={item.sku} alt="" className="h-10 w-10 rounded-md bg-slate-100 object-contain" />
                  )}
                  <span className="font-medium text-slate-800">{item.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">{renderQty ? renderQty(item.sku, item.qty) : item.qty}</td>
              <td className="px-4 py-3 text-right tabular-nums">{money(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t border-slate-200 bg-slate-50/60">
          <tr>
            <td colSpan={2} className="px-4 pt-3 text-right text-slate-500">
              Includes tax
            </td>
            <td className="px-4 pt-3 text-right text-slate-500 tabular-nums">{money(cart.tax)}</td>
          </tr>
          <tr>
            <td colSpan={2} className="px-4 pt-1 pb-3 text-right font-semibold text-slate-900">
              Total
            </td>
            <td className="px-4 pt-1 pb-3 text-right text-base font-bold text-slate-900 tabular-nums">
              {money(cart.total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
