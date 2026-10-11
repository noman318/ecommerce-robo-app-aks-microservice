type IconProps = { className?: string };

export const SearchIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 3.47 9.77l3.63 3.63a.75.75 0 1 0 1.06-1.06l-3.63-3.63A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.39c.51 0 .96.34 1.09.84l.38 1.44m0 0L6.8 12.6a1.5 1.5 0 0 0 1.45 1.11h8.9a1.5 1.5 0 0 0 1.45-1.12l1.65-6.17a.75.75 0 0 0-.72-.95H5.11ZM8.25 19.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

export const ChevronIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M7.2 14.8a.75.75 0 0 1 0-1.06L10.94 10 7.2 6.26a.75.75 0 1 1 1.06-1.06l4.27 4.27a.75.75 0 0 1 0 1.06L8.26 14.8a.75.75 0 0 1-1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export const StarIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10.87 2.6a.95.95 0 0 0-1.74 0L7.3 6.83l-4.6.4a.95.95 0 0 0-.54 1.66l3.49 3.03-1.04 4.5a.95.95 0 0 0 1.41 1.03L10 15.08l3.98 2.37a.95.95 0 0 0 1.41-1.03l-1.04-4.5 3.49-3.03a.95.95 0 0 0-.54-1.66l-4.6-.4-1.83-4.23Z" />
  </svg>
);

const Stroke = ({ className, d, width = 1.8 }: IconProps & { d: string; width?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

export const UserIcon = ({ className }: IconProps) => (
  <Stroke
    className={className}
    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.12a7.5 7.5 0 0 1 15 0A17.93 17.93 0 0 1 12 21.75c-2.68 0-5.22-.58-7.5-1.63Z"
  />
);

export const MinusIcon = ({ className }: IconProps) => <Stroke className={className} d="M5 12h14" width={2} />;

export const PlusIcon = ({ className }: IconProps) => <Stroke className={className} d="M12 5v14m-7-7h14" width={2} />;

export const CheckIcon = ({ className }: IconProps) => <Stroke className={className} d="m4.5 12.75 6 6 9-13.5" width={2.2} />;

export const ArrowRightIcon = ({ className }: IconProps) => (
  <Stroke className={className} d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" width={2} />
);

export const TrashIcon = ({ className }: IconProps) => (
  <Stroke
    className={className}
    d="m14.74 9-.35 9m-4.78 0-.35-9m9.97-3.21c.34.05.68.1 1.02.16m-1.02-.16L18.16 19.67A2.25 2.25 0 0 1 15.92 21.75H8.08a2.25 2.25 0 0 1-2.24-2.08L4.77 5.79m14.46 0a48.1 48.1 0 0 0-3.48-.4m-12 .56c.34-.06.68-.11 1.02-.16m0 0a48.1 48.1 0 0 1 3.48-.4m7.5 0v-.92c0-1.18-.91-2.16-2.09-2.2a51.96 51.96 0 0 0-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.92m7.5 0a48.67 48.67 0 0 0-7.5 0"
  />
);

export const TruckIcon = ({ className }: IconProps) => (
  <Stroke
    className={className}
    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.38A1.13 1.13 0 0 1 2.25 17.63V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.13c.62 0 1.13-.5 1.09-1.12a17.9 17.9 0 0 0-3.21-9.21 1.14 1.14 0 0 0-.92-.47H15.75m0 0V5.63c0-.62-.5-1.13-1.13-1.13H3.38c-.62 0-1.13.5-1.13 1.13v8.62m13.5-6.75v10.5"
  />
);

export const ShieldIcon = ({ className }: IconProps) => (
  <Stroke
    className={className}
    d="M9 12.75 11.25 15 15 9.75m-3-7.04A11.96 11.96 0 0 1 3.6 6 12 12 0 0 0 3 9.75c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.31-.21-2.57-.6-3.75h-.15c-3.2 0-6.1-1.25-8.25-3.29Z"
  />
);

export const SparkIcon = ({ className }: IconProps) => (
  <Stroke
    className={className}
    d="M9.81 15.9 9 18.75l-.81-2.85a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.85-.81a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.81 2.85a4.5 4.5 0 0 0 3.09 3.09l2.85.81-2.85.81a4.5 4.5 0 0 0-3.09 3.09ZM18.26 8.72 18 9.75l-.26-1.03a3.38 3.38 0 0 0-2.46-2.46L14.25 6l1.03-.26a3.38 3.38 0 0 0 2.46-2.46L18 2.25l.26 1.03a3.38 3.38 0 0 0 2.46 2.46l1.03.26-1.03.26a3.38 3.38 0 0 0-2.46 2.46Z"
  />
);
