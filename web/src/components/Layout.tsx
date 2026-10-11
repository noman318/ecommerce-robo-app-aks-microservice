import { useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { money } from '../format';
import { useShop } from '../ShopContext';
import Categories from './Categories';
import { CartIcon, SearchIcon, UserIcon } from './icons';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-zinc-100 text-ink' : 'text-zinc-600 hover:bg-zinc-100 hover:text-ink'
  }`;

export default function Layout() {
  const { cart, uniqueid, user } = useShop();
  const navigate = useNavigate();
  const { pathname } = useLocation();
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
      <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-zinc-300">
        A polyglot microservices store — <span className="text-white">every request traced end to end</span>
      </div>

      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-600/25 transition group-hover:rotate-[-6deg]">
              <img src="/media/stan.png" alt="" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-display text-lg leading-none font-bold tracking-tight text-ink">
              Stan's <span className="text-brand-600">Robot</span> Shop
            </span>
          </Link>

          <form onSubmit={onSearch} className="order-last w-full lg:order-none lg:mx-auto lg:max-w-xl lg:flex-1" role="search">
            <label htmlFor="search" className="sr-only">
              Search robots
            </label>
            <div className="group relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-brand-600" />
              <input
                id="search"
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for robots, droids, companions…"
                className="w-full rounded-full border-0 bg-zinc-100 py-2.5 pr-4 pl-11 text-sm text-ink ring-1 ring-transparent transition placeholder:text-zinc-500 hover:bg-zinc-200/60 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-1" aria-label="Account">
            <NavLink to="/login" className={navClass}>
              <UserIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{user ? user.name : 'Sign in'}</span>
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-sm font-semibold transition ${
                  isActive ? 'bg-brand-600 text-white' : 'bg-ink text-white hover:bg-zinc-800'
                }`
              }
            >
              <CartIcon className="h-5 w-5" />
              <span className="tabular-nums">{cart.total ? money(cart.total) : 'Cart'}</span>
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 animate-fade-in items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white ring-2 ring-white"
                >
                  {itemCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-10">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <Categories />
          </div>
        </aside>
        <main key={pathname} className="min-w-0 flex-1 animate-fade-in">
          <Outlet />
        </main>
      </div>

      <footer className="mt-10 border-t border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
          <div className="space-y-3">
            <p className="font-display text-base font-bold text-ink">
              Stan's <span className="text-brand-600">Robot</span> Shop
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
              An example e-commerce application split into independent services, each built with a different
              technology.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-ink">Shop</p>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link to="/cart" className="transition hover:text-ink">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-ink">
                  Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-ink">Project</p>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <a href="https://github.com/instana/robot-shop" target="_blank" rel="noreferrer" className="transition hover:text-ink">
                  Source on GitHub
                </a>
              </li>
              <li>
                <a href="https://instana.com/" target="_blank" rel="noreferrer" className="transition hover:text-ink">
                  Instana
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-100">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-zinc-400 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
            <span>© Stan's Robot Shop — a microservices demo</span>
            <span className="font-mono">session {uniqueid || '…'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
