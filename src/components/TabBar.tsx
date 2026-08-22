'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: "Aujourd'hui", icon: 'today' },
  { href: '/semaine', label: 'Semaine', icon: 'week' },
  { href: '/objectifs', label: 'Objectifs', icon: 'goal' },
  { href: '/progres', label: 'Progrès', icon: 'progress' },
  { href: '/reglages', label: 'Réglages', icon: 'settings' },
] as const;

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'today':
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="16" rx="3" />
          <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
          <path d="M8.8 14.2 11 16.4l4.2-4.4" />
        </svg>
      );
    case 'week':
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="16" rx="3" />
          <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
          <path d="M7.5 13h3M7.5 16.8h3M13.5 13h3M13.5 16.8h3" />
        </svg>
      );
    case 'goal':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="12" cy="12" r="0.6" fill="currentColor" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...common}>
          <path d="M3 16.8 9 10.6l4 4L21 6.6" />
          <path d="M15 6.6h6v6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3.5 7h9M17 7h3.5M3.5 17h5.5M13.5 17h7" />
          <circle cx="14.8" cy="7" r="2.3" />
          <circle cx="11.3" cy="17" r="2.3" />
        </svg>
      );
  }
}

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className="tab" data-on={active}>
            <Icon name={tab.icon} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
