import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, errorMessage } from '../api';
import LocationAutocomplete from '../components/LocationAutocomplete';
import Steps from '../components/Steps';
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
    <div className="mx-auto max-w-xl space-y-6">
      <Steps current={1} />
      <h1 className="page-title">Shipping information</h1>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="card space-y-5 p-6">
        <div>
          <label htmlFor="country" className="label">
            Country
          </label>
          <select
            id="country"
            className="input"
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
            Location
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

        <button type="button" onClick={calculate} disabled={!location || busy} className="btn-secondary w-full">
          {busy && !quote ? 'Calculating…' : 'Calculate shipping'}
        </button>
      </div>

      {quote && (
        <div className="card space-y-4 p-6">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Distance</dt>
              <dd className="text-lg font-semibold text-slate-900 tabular-nums">{quote.distance} km</dd>
            </div>
            <div>
              <dt className="text-slate-500">Shipping cost</dt>
              <dd className="text-lg font-semibold text-slate-900 tabular-nums">{money(quote.cost)}</dd>
            </div>
          </dl>
          <button type="button" onClick={confirm} disabled={busy} className="btn-primary w-full py-2.5">
            Confirm and continue to payment
          </button>
        </div>
      )}
    </div>
  );
}
