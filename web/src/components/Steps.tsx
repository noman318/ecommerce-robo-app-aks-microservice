import { CheckIcon } from './icons';

/** Checkout progress indicator shown on shipping and payment. */
export default function Steps({ current }: { current: 0 | 1 | 2 }) {
  const steps = ['Cart', 'Shipping', 'Payment'];
  return (
    <ol className="flex items-center text-sm font-medium" aria-label="Checkout progress">
      {steps.map((s, i) => (
        <li key={s} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`} aria-current={i === current ? 'step' : undefined}>
          <span className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                i < current
                  ? 'bg-ink text-white'
                  : i === current
                    ? 'bg-brand-600 text-white shadow-md ring-4 shadow-brand-600/30 ring-brand-100'
                    : 'bg-white text-zinc-400 ring-1 ring-zinc-300'
              }`}
            >
              {i < current ? <CheckIcon className="h-4 w-4" /> : i + 1}
            </span>
            <span className={i === current ? 'text-ink' : i < current ? 'text-zinc-700' : 'text-zinc-400'}>{s}</span>
          </span>
          {i < steps.length - 1 && (
            <span className={`mx-3 h-0.5 flex-1 rounded-full sm:mx-4 ${i < current ? 'bg-ink' : 'bg-zinc-200'}`} />
          )}
        </li>
      ))}
    </ol>
  );
}
