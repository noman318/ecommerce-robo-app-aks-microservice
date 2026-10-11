import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from './api';
import { ineum } from './instana';
import { EMPTY_CART, type Cart, type User } from './types';

interface ShopState {
  /** Anonymous session id, or the user name once logged in. Empty until loaded. */
  uniqueid: string;
  user: User | null;
  cart: Cart;
  setCart: (cart: Cart) => void;
  /** Switch the session to a logged-in user (cart already renamed by the caller). */
  signIn: (user: User) => void;
}

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [uniqueid, setUniqueid] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart>(EMPTY_CART);

  useEffect(() => {
    api
      .uniqueId()
      .then(({ uuid }) => {
        setUniqueid((current) => current || uuid);
        ineum('user', uuid);
        ineum('meta', 'environment', 'production');
        ineum('meta', 'variant', 'normal price');
      })
      .catch((e) => console.error('uniqueid', e));
  }, []);

  const value = useMemo<ShopState>(
    () => ({
      uniqueid,
      user,
      cart,
      setCart,
      signIn: (u) => {
        setUser(u);
        setUniqueid(u.name);
        ineum('user', u.name, u.name, u.email);
      },
    }),
    [uniqueid, user, cart],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopState {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
