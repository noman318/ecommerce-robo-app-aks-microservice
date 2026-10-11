import { useState } from 'react';
import { Link } from 'react-router';
import { api, errorMessage } from '../api';
import { CheckIcon, ShieldIcon } from '../components/icons';
import { Alert, EmptyState, LineItems, Totals } from '../components/ui';
import { useShop } from '../ShopContext';
import { EMPTY_CART } from '../types';
import Steps from '../components/Steps';

export default function Payment() {
  const { uniqueid, cart, setCart } = useShop();
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const pay = async () => {
    setPaying(true);
    setError('');
    try {
      const res = await api.pay(uniqueid, cart);
      setOrderId(res.orderid);
      setCart(EMPTY_CART);
    } catch (e) {
      setError(`Error placing order: ${errorMessage(e)}`);
      setPaying(false);
    }
  };

  if (orderId) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card relative flex animate-fade-in flex-col items-center gap-4 overflow-hidden px-6 py-14 text-center sm:px-10">
          <div className="absolute inset-x-0 top-0 -z-0 h-32 bg-gradient-to-b from-emerald-50 to-transparent" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-8 shadow-emerald-500/30 ring-emerald-100">
            <CheckIcon className="h-8 w-8" />
          </span>
          <h1 className="page-title relative mt-2">Thank you for your order</h1>
          <p className="relative text-zinc-500">Your robot is being prepared for its journey.</p>
          <div className="relative mt-2 rounded-xl bg-zinc-50 px-5 py-3 ring-1 ring-zinc-950/5">
            <p className="text-xs font-medium text-zinc-500">Order number</p>
            <p className="font-mono text-sm font-semibold text-ink">{orderId}</p>
          </div>
          <Link to="/" className="btn-primary btn-lg relative mt-4">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const hasItems = cart.items?.length > 0 && cart.total !== 0;

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl">
        <Steps current={2} />
      </div>
      <h1 className="page-title">Review your order</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {hasItems ? (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <LineItems cart={cart} />
          <div className="lg:sticky lg:top-24">
            <Totals cart={cart}>
              <button type="button" onClick={pay} disabled={paying} className="btn-accent btn-lg w-full">
                <ShieldIcon className="h-5 w-5" />
                {paying ? 'Processing…' : 'Pay now'}
              </button>
            </Totals>
          </div>
        </div>
      ) : (
        <EmptyState title="Nothing to pay for yet">
          <p className="text-sm text-zinc-500">Add a robot to your cart to get started.</p>
          <Link to="/" className="btn-primary mt-3">
            Browse robots
          </Link>
        </EmptyState>
      )}
    </div>
  );
}
