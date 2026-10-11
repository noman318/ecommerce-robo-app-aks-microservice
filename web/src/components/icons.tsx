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
