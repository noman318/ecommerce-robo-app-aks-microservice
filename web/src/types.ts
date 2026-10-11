export interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  instock: number;
}

export interface CartItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  total: number;
  tax?: number;
  items: CartItem[];
}

export interface User {
  name: string;
  email: string;
}

export interface Rating {
  avg_rating: number;
  rating_count: number;
}

export interface Country {
  uuid?: number;
  code: string;
  name: string;
}

export interface LocationMatch {
  uuid: number;
  name: string;
}

export interface ShippingQuote {
  distance: number;
  cost: number;
  location?: string;
}

export interface Order {
  orderid: string;
  cart: Cart;
}

export const EMPTY_CART: Cart = { total: 0, items: [] };
