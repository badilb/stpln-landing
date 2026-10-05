// Один набор иконок, один штрих 1.6 — чтобы не смешивать стили (Hallmark: mismatched icon sets).

const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
  cart: <><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" /><circle cx="9" cy="19" r="1.3" /><circle cx="17" cy="19" r="1.3" /></>,
  compare: <><path d="M7 4v16M17 4v16" /><path d="M4 8h6M14 15h6" /></>,
  phone: <path d="M5 4h3.5l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7l1.3-2 4 1.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />,
  whatsapp: <><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8 18.4Z" /><path d="M9.2 8.6c.2 2.6 2.3 4.8 5 5.2l1-1.1-1.6-.9-.7.6a4 4 0 0 1-2-2l.6-.7-.9-1.6Z" /></>,
  pin: <><path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17.5" cy="17.5" r="1.6" /></>,
  box: <><path d="M4 8l8-4 8 4v8l-8 4-8-4Z" /><path d="M4 8l8 4 8-4M12 12v8" /></>,
  layers: <><path d="m12 4 9 5-9 5-9-5Z" /><path d="m3 14 9 5 9-5" /></>,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".6" /></>,
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  arrowLeft: <path d="M15 6l-6 6 6 6" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
