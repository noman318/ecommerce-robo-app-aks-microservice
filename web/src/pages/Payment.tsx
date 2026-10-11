import { useState } from 'react';
import { Link } from 'react-router';
import { api, errorMessage } from '../api';
import { Alert, OrderSummary } from '../components/ui';
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
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </span>
          <h1 className="page-title">Thank you for your order</h1>
          <p className="text-slate-500">
            Order <span className="font-mono font-medium text-slate-800">{orderId}</span> has been placed.
          </p>
          <Link to="/" className="btn-primary mt-2">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const hasItems = cart.items?.length > 0 && cart.total !== 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Steps current={2} />
      <h1 className="page-title">Review your order</h1>

      {error && <Alert tone="error">{error}</Alert>}

      {hasItems ? (
        <>
          <OrderSummary cart={cart} />
          <div className="flex justify-end">
            <button type="button" onClick={pay} disabled={paying} className="btn-primary px-6 py-2.5">
              {paying ? 'Processing…' : 'Pay now'}
            </button>
          </div>
        </>
      ) : (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <p className="text-slate-500">There is nothing to pay for yet.</p>
          <Link to="/" className="btn-secondary">
            Browse robots
          </Link>
        </div>
      )}
    </div>
  );
}
