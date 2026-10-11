/** Checkout progress indicator shown on shipping and payment. */
export default function Steps({ current }: { current: 0 | 1 | 2 }) {
  const steps = ['Cart', 'Shipping', 'Payment'];
  return (
    <ol className="flex items-center gap-2 text-xs font-medium">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              i < current
                ? 'bg-brand-600 text-white'
                : i === current
                  ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-600'
                  : 'bg-slate-200 text-slate-500'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </span>
          <span className={i === current ? 'text-slate-900' : 'text-slate-500'}>{s}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-8 bg-slate-300" />}
        </li>
      ))}
    </ol>
  );
}
