import { useEffect, useState, type FormEvent } from 'react';
import { api, errorMessage } from '../api';
import { Alert, EmptyState, ProductImage, Spinner } from '../components/ui';
import { money } from '../format';
import { useShop } from '../ShopContext';
import type { Order } from '../types';

export default function Login() {
  const { user } = useShop();
  return user ? <Account /> : <AuthForms />;
}

function AuthForms() {
  const { uniqueid, signIn } = useShop();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    const u = await api.login(name.trim(), password);
    // move the anonymous cart across to the user; 404 is fine, there may be no cart yet
    api.renameCart(uniqueid, u.name).catch(() => {});
    signIn({ name: u.name, email: u.email });
  };

  const register = async () => {
    const n = name.trim();
    const em = email.trim();
    if (!n || !em || !password) throw new Error('Please fill in every field');
    if (password !== password2) throw new Error('Passwords do not match');
    await api.register(n, em, password);
    signIn({ name: n, email: em });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await (mode === 'login' ? login() : register());
    } catch (err) {
      setError(errorMessage(err));
      setPassword('');
      setPassword2('');
      setBusy(false);
    }
  };

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setError('');
  };

  return (
    <div className="mx-auto max-w-md py-4">
      <div className="mb-8 text-center">
        <img src="/media/stan.png" alt="" className="mx-auto h-14 w-14 object-contain" />
        <h1 className="page-title mt-4">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {mode === 'login' ? 'Sign in to see your orders and keep your cart.' : 'It only takes a moment.'}
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1 text-sm font-semibold" role="tablist">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`rounded-full py-2 transition ${
                mode === m ? 'bg-white text-ink shadow-sm ring-1 ring-zinc-950/5' : 'text-zinc-500 hover:text-ink'
              }`}
            >
              {m === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <Alert tone="error">{error}</Alert>}

          <Field id="name" label="Name" value={name} onChange={setName} autoComplete="username" />
          {mode === 'register' && (
            <Field id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          )}
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'register' && (
            <Field
              id="password2"
              label="Confirm password"
              type="password"
              value={password2}
              onChange={setPassword2}
              autoComplete="new-password"
            />
          )}

          <button type="submit" disabled={busy} className="btn-primary btn-lg mt-2 w-full">
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="label">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type ?? 'text'}
        value={props.value}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
        required
        className="input"
      />
    </div>
  );
}

function Account() {
  const { user } = useShop();
  const [history, setHistory] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .history(user.name)
      .then((r) => setHistory(r.history ?? []))
      .catch((e) => {
        console.error('history', e);
        setHistory([]);
      });
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-pop sm:p-8">
        <div className="absolute -top-20 -right-10 h-60 w-60 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-fuchsia-500 font-display text-xl font-bold text-white uppercase shadow-lg">
            {user.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="text-sm text-zinc-400">Greetings,</p>
            <h1 className="truncate font-display text-2xl font-bold tracking-tight text-white">{user.name}</h1>
            <p className="truncate text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="section-title">Order history</h2>
          {history && history.length > 0 && (
            <span className="text-sm text-zinc-500">
              {history.length} order{history.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
        {history === null ? (
          <Spinner />
        ) : history.length === 0 ? (
          <EmptyState title="No orders yet">
            <p className="text-sm text-zinc-500">When you place an order it will show up here.</p>
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {history.map((order) => {
              const items = order.cart.items.filter((i) => i.sku !== 'SHIP');
              return (
                <li key={order.orderid} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">Order</p>
                      <p className="font-mono text-sm font-semibold text-ink">#{order.orderid}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 ring-inset">Paid</span>
                      <span className="price text-lg">{money(order.cart.total)}</span>
                    </div>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
                    {items.map((item) => (
                      <li key={item.sku} className="chip py-1 pr-3 pl-1">
                        <span className="tile flex h-6 w-6 items-center justify-center rounded-full p-0.5">
                          <ProductImage sku={item.sku} alt="" className="max-h-full max-w-full object-contain" />
                        </span>
                        {item.qty > 1 ? `${item.qty} × ` : ''}
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
