import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api, ApiError, errorMessage } from '../api';
import { Alert, OrderSummary, Spinner } from '../components/ui';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Shopping cart</h1>
        <p className="mt-1 font-mono text-xs text-slate-400">{uniqueid}</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {isEmpty ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <p className="text-slate-500">Your cart is empty — time to go shopping.</p>
          <Link to="/" className="btn-secondary">
            Browse robots
          </Link>
        </div>
      ) : (
        <>
          <OrderSummary
            cart={cart}
            renderQty={(sku, qty) => <QtyInput key={`${sku}-${qty}`} value={qty} onCommit={(q) => changeQty(sku, q)} />}
          />
          <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/shipping')} className="btn-primary px-6 py-2.5">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** Quantity box that updates the cart once the value is a valid 0–10; 0 removes the item. */
function QtyInput({ value, onCommit }: { value: number; onCommit: (qty: number) => void }) {
  const [text, setText] = useState(String(value));

  return (
    <div className="inline-flex items-center gap-2">
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
        className="input w-16 px-2 py-1 text-center"
      />
      <button
        type="button"
        onClick={() => onCommit(0)}
        className="text-xs text-slate-400 hover:text-rose-600"
        aria-label="Remove item"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}
