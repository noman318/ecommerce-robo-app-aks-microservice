import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api, errorMessage } from '../api';
import { StarIcon } from '../components/icons';
import { Alert, ProductImage, Spinner, useFlash } from '../components/ui';
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
  if (!product) return <Spinner />;

  const inStock = product.instock > 0;
  const shownStars = hover || Math.round(rating.avg_rating);

  return (
    <div className="space-y-4">
      {flash && <Alert tone={flash.tone}>{flash.text}</Alert>}

      <article className="card grid overflow-hidden md:grid-cols-2">
        <div className="flex items-center justify-center bg-slate-100 p-8">
          <ProductImage sku={product.sku} alt={product.name} className="max-h-80 w-auto object-contain" />
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <h1 className="page-title">{product.name}</h1>
            <p className="mt-2 text-3xl font-bold text-brand-700 tabular-nums">{money(product.price)}</p>
          </div>

          <div>
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((vote) => (
                <button
                  key={vote}
                  type="button"
                  onMouseEnter={() => setHover(vote)}
                  onFocus={() => setHover(vote)}
                  onBlur={() => setHover(0)}
                  onClick={() => rate(vote)}
                  aria-label={`Rate ${vote} out of 5`}
                  className="rounded p-0.5 transition hover:scale-110"
                >
                  <StarIcon className={`h-6 w-6 ${vote <= shownStars ? 'text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {rating.avg_rating > 0
                ? `${rating.avg_rating.toFixed(1)} from ${rating.rating_count} vote${rating.rating_count === 1 ? '' : 's'}`
                : 'No votes yet. Be the first to rate.'}
            </p>
          </div>

          <p className="leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-auto border-t border-slate-100 pt-5">
            {inStock ? (
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-24">
                  <label htmlFor="qty" className="label">
                    Quantity
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                    className="input"
                  />
                </div>
                <button type="button" onClick={addToCart} disabled={adding || !uniqueid} className="btn-primary px-6 py-2.5">
                  {adding ? 'Adding…' : 'Add to cart'}
                </button>
              </div>
            ) : (
              <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                Out of stock
              </span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
