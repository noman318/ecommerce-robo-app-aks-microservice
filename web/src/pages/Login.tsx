import { useEffect, useState, type FormEvent } from 'react';
import { api, errorMessage } from '../api';
import { Alert, Spinner } from '../components/ui';
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
    <div className="mx-auto max-w-md">
      <div className="card overflow-hidden">
        <div className="grid grid-cols-2 border-b border-slate-200 text-sm font-semibold" role="tablist">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={`py-3 transition ${
                mode === m ? 'border-b-2 border-brand-600 text-brand-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
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

          <button type="submit" disabled={busy} className="btn-primary w-full py-2.5">
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
    <div className="space-y-6">
      <div className="card flex items-center gap-4 p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 uppercase">
          {user.name.slice(0, 1)}
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Greetings, {user.name}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Order history</h2>
        {history === null ? (
          <Spinner />
        ) : history.length === 0 ? (
          <div className="card p-8 text-center text-sm text-slate-500">No orders yet.</div>
        ) : (
          <ul className="space-y-3">
            {history.map((order) => (
              <li key={order.orderid} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-500">#{order.orderid}</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{money(order.cart.total)}</span>
                </div>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {order.cart.items.map((item) => (
                    <li key={item.sku} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {item.qty > 1 ? `${item.qty} × ` : ''}
                      {item.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
