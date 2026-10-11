import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError, errorMessage } from '../api';
import { ArrowRightIcon, CartIcon, MinusIcon, PlusIcon, TrashIcon } from '../components/icons';
import { Alert, EmptyState, LineItems, Spinner, Totals } from '../components/ui';
import { useShop } from '../ShopContext';
import { EMPTY_CART } from '../types';

export default function Cart() {
  const { uniqueid, cart, setCart } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uniqueid) return;
    let active = true;
    (async () => {
      try {
        let loaded = await api.cart(uniqueid);
        // Coming back from checkout: drop the shipping line so it gets recalculated
        if (loaded.items.at(-1)?.sku === 'SHIP') {
          loaded = await api.updateCart(uniqueid, 'SHIP', 0);
        }
        if (active) setCart(loaded);
      } catch (e) {
        // 404 just means this session has no cart yet
        if (e instanceof ApiError && e.status === 404) {
          if (active) setCart(EMPTY_CART);
        } else if (active) {
          setError(errorMessage(e));
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [uniqueid, setCart]);

  const changeQty = async (sku: string, qty: number) => {
    setError('');
    try {
      setCart(await api.updateCart(uniqueid, sku, qty));
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  if (loading) return <Spinner label="Loading your cart…" />;

  const isEmpty = !cart.items?.length || cart.total === 0;

  const itemCount = cart.items?.reduce((n, i) => n + (i.sku === 'SHIP' ? 0 : i.qty), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Your cart</h1>
          {!isEmpty && (
            <p className="mt-2 text-sm text-zinc-500">
              {itemCount} item{itemCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <p className="font-mono text-xs text-zinc-400">{uniqueid}</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {isEmpty ? (
        <EmptyState icon={<CartIcon className="h-6 w-6" />} title="Your cart is empty">
          <p className="text-sm text-zinc-500">Time to go shopping. Stan's friends are waiting.</p>
          <Link to="/" className="btn-primary mt-3">
            Browse robots
          </Link>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <LineItems
              cart={cart}
              renderQty={(sku, qty) => <QtyInput key={`${sku}-${qty}`} value={qty} onCommit={(q) => changeQty(sku, q)} />}
            />
            <Link to="/" className="btn-ghost -ml-3">
              ← Continue shopping
            </Link>
          </div>
          <div className="lg:sticky lg:top-24">
            <Totals cart={cart}>
              <button type="button" onClick={() => navigate('/shipping')} className="btn-primary btn-lg w-full">
                Checkout <ArrowRightIcon className="h-4 w-4" />
              </button>
            </Totals>
          </div>
        </div>
      )}
    </div>
  );
}

/** Quantity stepper that updates the cart once the value is a valid 0–10; 0 removes the item. */
function QtyInput({ value, onCommit }: { value: number; onCommit: (qty: number) => void }) {
  const [text, setText] = useState(String(value));

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full bg-white p-0.5 ring-1 ring-zinc-300 ring-inset">
        <button
          type="button"
          className="icon-btn h-7 w-7"
          onClick={() => onCommit(value - 1)}
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          min={0}
          max={10}
          value={text}
          aria-label="Quantity"
          onChange={(e) => {
            setText(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value !== '' && Number.isInteger(n) && n >= 0 && n <= 10 && n !== value) onCommit(n);
          }}
          onBlur={() => setText(String(value))}
          className="w-8 border-0 bg-transparent text-center text-sm font-semibold text-ink tabular-nums focus:outline-none"
        />
        <button
          type="button"
          className="icon-btn h-7 w-7"
          onClick={() => onCommit(value + 1)}
          disabled={value >= 10}
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onCommit(0)}
        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-rose-600"
        aria-label="Remove item"
      >
        <TrashIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    </div>
  );
}
