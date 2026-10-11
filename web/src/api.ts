import type {
  Cart, Country, LocationMatch, Order, Product, Rating, ShippingQuote, User,
} from './types';

export class ApiError extends Error {
  constructor(public status: number, public body: string) {
    super(body || `HTTP ${status}`);
  }
}

async function request<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new ApiError(res.status, text);
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

const enc = encodeURIComponent;

export const api = {
  // catalogue
  categories: () => request<string[]>('/api/catalogue/categories'),
  productsByCategory: (cat: string) => request<Product[]>(`/api/catalogue/products/${enc(cat)}`),
  product: (sku: string) => request<Product>(`/api/catalogue/product/${enc(sku)}`),
  search: (text: string) => request<Product[]>(`/api/catalogue/search/${enc(text)}`),

  // ratings
  rating: (sku: string) => request<Rating>(`/api/ratings/api/fetch/${enc(sku)}`),
  rate: (sku: string, score: number) => request<unknown>(`/api/ratings/api/rate/${enc(sku)}/${score}`, 'PUT'),

  // user
  uniqueId: () => request<{ uuid: string }>('/api/user/uniqueid'),
  login: (name: string, password: string) => request<User>('/api/user/login', 'POST', { name, password }),
  register: (name: string, email: string, password: string) =>
    request<unknown>('/api/user/register', 'POST', { name, email, password }),
  history: (name: string) => request<{ history: Order[] }>(`/api/user/history/${enc(name)}`),

  // cart
  cart: (id: string) => request<Cart>(`/api/cart/cart/${enc(id)}`),
  addToCart: (id: string, sku: string, qty: number) =>
    request<Cart>(`/api/cart/add/${enc(id)}/${enc(sku)}/${qty}`),
  updateCart: (id: string, sku: string, qty: number) =>
    request<Cart>(`/api/cart/update/${enc(id)}/${enc(sku)}/${qty}`),
  renameCart: (from: string, to: string) => request<unknown>(`/api/cart/rename/${enc(from)}/${enc(to)}`),

  // shipping
  countries: () => request<Country[]>('/api/shipping/codes'),
  matchLocation: (code: string, term: string) =>
    request<LocationMatch[]>(`/api/shipping/match/${enc(code)}/${enc(term)}`),
  calcShipping: (uuid: number) => request<ShippingQuote>(`/api/shipping/calc/${uuid}`),
  confirmShipping: (id: string, quote: ShippingQuote) =>
    request<Cart>(`/api/shipping/confirm/${enc(id)}`, 'POST', quote),

  // payment
  pay: (id: string, cart: Cart) => request<{ orderid: string }>(`/api/payment/pay/${enc(id)}`, 'POST', cart),
};

export function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.body || `Request failed (${e.status})`;
  if (e instanceof Error) return e.message;
  return String(e);
}
