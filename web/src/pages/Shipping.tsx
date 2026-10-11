import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, errorMessage } from '../api';
import LocationAutocomplete from '../components/LocationAutocomplete';
import Steps from '../components/Steps';
import { ArrowRightIcon, TruckIcon } from '../components/icons';
import { Alert } from '../components/ui';
import { money } from '../format';
import { useShop } from '../ShopContext';
import type { Country, LocationMatch, ShippingQuote } from '../types';

export default function Shipping() {
  const { uniqueid, setCart } = useShop();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [location, setLocation] = useState<LocationMatch | null>(null);
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .countries()
      .then(setCountries)
      .catch((e) => setError(`Could not load countries: ${errorMessage(e)}`));
  }, []);

  const calculate = async () => {
    if (!location || !country) return;
    setBusy(true);
    setError('');
    try {
      const q = await api.calcShipping(location.uuid);
      setQuote({ ...q, location: `${country.name} ${location.name}` });
    } catch (e) {
      setError(`Could not calculate shipping: ${errorMessage(e)}`);
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!quote) return;
    setBusy(true);
    setError('');
    try {
      setCart(await api.confirmShipping(uniqueid, quote));
      navigate('/payment');
    } catch (e) {
      setError(`Could not confirm shipping: ${errorMessage(e)}`);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Steps current={1} />
      <div>
        <h1 className="page-title">Shipping</h1>
        <p className="mt-2 text-sm text-zinc-500">Tell us where your robot is headed and we'll work out the delivery cost.</p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="card space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="label">
              Country
            </label>
            <select
              id="country"
              className="input select"
              value={country?.code ?? ''}
              onChange={(e) => {
                setCountry(countries.find((c) => c.code === e.target.value) ?? null);
                setLocation(null);
                setQuote(null);
              }}
            >
              <option value="" disabled>
                Select a country…
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="label">
              Town or city
            </label>
            <LocationAutocomplete
              countryCode={country?.code ?? ''}
              disabled={!country}
              onSelect={(m) => {
                setLocation(m);
                setQuote(null);
              }}
            />
          </div>
        </div>

        <button type="button" onClick={calculate} disabled={!location || busy} className="btn-secondary w-full">
          <TruckIcon className="h-4 w-4" />
          {busy && !quote ? 'Calculating…' : 'Calculate shipping'}
        </button>
      </div>

      {quote && (
        <div className="card animate-fade-in space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <TruckIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-zinc-500">Delivering to</p>
              <p className="font-semibold text-ink">{quote.location}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-950/5">
              <dt className="text-xs font-medium text-zinc-500">Distance</dt>
              <dd className="price mt-1 text-2xl">{quote.distance} km</dd>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-950/5">
              <dt className="text-xs font-medium text-zinc-500">Shipping cost</dt>
              <dd className="price mt-1 text-2xl">{money(quote.cost)}</dd>
            </div>
          </dl>
          <button type="button" onClick={confirm} disabled={busy} className="btn-primary btn-lg w-full">
            Continue to payment <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
