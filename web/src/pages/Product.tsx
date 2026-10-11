import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api, errorMessage } from '../api';
import { CartIcon, MinusIcon, PlusIcon, ShieldIcon, StarIcon, TruckIcon } from '../components/icons';
import { Alert, ProductImage, useFlash } from '../components/ui';
import { money } from '../format';
import { useShop } from '../ShopContext';
import type { Product, Rating } from '../types';

export default function ProductPage() {
  const { sku = '' } = useParams();
  const { uniqueid, setCart } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState<Rating>({ avg_rating: 0, rating_count: 0 });
  const [hover, setHover] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [flash, setFlash] = useFlash();

  const loadRating = useCallback(() => {
    api
      .rating(sku)
      .then(setRating)
      .catch((e) => console.error('rating', e));
  }, [sku]);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    setQuantity(1);
    api
      .product(sku)
      .then((p) => active && setProduct(p))
      .catch((e) => {
        console.error('product', e);
        if (active) setNotFound(true);
      });
    loadRating();
    return () => {
      active = false;
    };
  }, [sku, loadRating]);

  const addToCart = async () => {
    if (!product || !uniqueid) return;
    setAdding(true);
    try {
      setCart(await api.addToCart(uniqueid, product.sku, quantity));
      setFlash({ tone: 'success', text: `Added ${quantity} × ${product.name} to your cart` });
    } catch (e) {
      setFlash({ tone: 'error', text: `Could not add to cart: ${errorMessage(e)}` });
    } finally {
      setAdding(false);
    }
  };

  const rate = async (score: number) => {
    try {
      await api.rate(sku, score);
      setFlash({ tone: 'success', text: 'Thank you for your feedback' });
      loadRating();
    } catch (e) {
      setFlash({ tone: 'error', text: `Could not save rating: ${errorMessage(e)}` });
    }
  };

  if (notFound) return <Alert tone="error">Sorry, we couldn't find that robot.</Alert>;
  if (!product) {
    return (
      <div className="grid gap-8 md:grid-cols-2" aria-busy="true">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-4 py-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  const inStock = product.instock > 0;
  const shownStars = hover || Math.round(rating.avg_rating);

  const clampQty = (n: number) => Math.min(10, Math.max(1, n || 1));

  return (
    <div className="space-y-5">
      {flash && <Alert tone={flash.tone}>{flash.text}</Alert>}

      <article className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <div className="tile relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-10 ring-1 ring-zinc-950/5">
            <div className="absolute inset-x-12 bottom-10 h-8 rounded-full bg-zinc-900/10 blur-xl" />
            <ProductImage
              sku={product.sku}
              alt={product.name}
              className="relative max-h-full w-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:py-2">
          <div>
            <p className="eyebrow">SKU {product.sku}</p>
            <h1 className="page-title mt-2">{product.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((vote) => (
                  <button
                    key={vote}
                    type="button"
                    onMouseEnter={() => setHover(vote)}
                    onFocus={() => setHover(vote)}
                    onBlur={() => setHover(0)}
                    onClick={() => rate(vote)}
                    aria-label={`Rate ${vote} out of 5`}
                    className="rounded-md p-0.5 transition hover:scale-125"
                  >
                    <StarIcon className={`h-5 w-5 transition ${vote <= shownStars ? 'text-amber-400' : 'text-zinc-300'}`} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-zinc-500">
                {rating.avg_rating > 0 ? (
                  <>
                    <span className="font-semibold text-ink">{rating.avg_rating.toFixed(1)}</span> ·{' '}
                    {rating.rating_count} rating{rating.rating_count === 1 ? '' : 's'}
                  </>
                ) : (
                  'No ratings yet. Be the first.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="price text-4xl">{money(product.price)}</p>
            {inStock ? (
              <span className="badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 ring-inset">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                In stock
              </span>
            ) : (
              <span className="badge bg-rose-50 text-rose-700 ring-1 ring-rose-200 ring-inset">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Out of stock
              </span>
            )}
          </div>

          <p className="leading-relaxed text-zinc-600">{product.description}</p>

          <div className="card space-y-4 p-5">
            {inStock ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center justify-between rounded-full bg-white p-1 ring-1 ring-zinc-300 ring-inset sm:w-36">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setQuantity((q) => clampQty(q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <label htmlFor="qty" className="sr-only">
                    Quantity
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(clampQty(Number(e.target.value)))}
                    className="w-10 border-0 bg-transparent text-center text-sm font-semibold text-ink tabular-nums focus:outline-none"
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setQuantity((q) => clampQty(q + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={adding || !uniqueid}
                  className="btn-accent btn-lg flex-1"
                >
                  <CartIcon className="h-5 w-5" />
                  {adding ? 'Adding…' : 'Add to cart'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">This robot is currently unavailable. Check back soon.</p>
            )}
            <ul className="grid gap-2 border-t border-zinc-100 pt-4 text-sm text-zinc-500 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-zinc-400" /> Shipping calculated at checkout
              </li>
              <li className="flex items-center gap-2">
                <ShieldIcon className="h-4 w-4 text-zinc-400" /> Up to 10 per order
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}
