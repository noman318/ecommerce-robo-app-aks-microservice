import { useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { money } from '../format';
import { useShop } from '../ShopContext';
import Categories from './Categories';
import { CartIcon, SearchIcon } from './icons';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`;

export default function Layout() {
  const { cart, uniqueid, user } = useShop();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const itemCount = cart.items?.reduce((n, i) => n + (i.sku === 'SHIP' ? 0 : i.qty), 0) ?? 0;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const text = searchText.trim();
    if (!text) return;
    navigate(`/search/${encodeURIComponent(text)}`);
    setSearchText('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:flex-nowrap">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img src="/media/stan.png" alt="" className="h-10 w-10 rounded-full bg-white/10 object-contain p-1" />
            <span className="font-display text-lg font-extrabold tracking-wide sm:text-xl">
              Stan's <span className="text-brand-400">Robot</span> Shop
            </span>
          </Link>

          <form onSubmit={onSearch} className="order-last w-full sm:order-none sm:ml-6 sm:max-w-md sm:flex-1" role="search">
            <label htmlFor="search" className="sr-only">
              Search robots
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="search"
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search robots…"
                className="w-full rounded-full border border-slate-700 bg-slate-900 py-2 pr-4 pl-9 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40 focus:outline-none"
              />
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-2 text-sm font-medium">
            <NavLink to="/login" className={navClass}>
              {user ? user.name : 'Sign in'}
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              <span className="relative">
                <CartIcon className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold">
                    {itemCount}
                  </span>
                )}
              </span>
              <span>{cart.total ? money(cart.total) : 'Cart'}</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8">
        <aside className="lg:w-64 lg:shrink-0">
          <Categories />
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <span>Stan's Robot Shop — a microservices demo</span>
          <span className="font-mono">{uniqueid || '…'}</span>
        </div>
      </footer>
    </div>
  );
}
