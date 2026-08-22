'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: "Aujourd'hui", icon: 'today' },
  { href: '/seances', label: 'Séances', icon: 'session' },
  { href: '/progression', label: 'Progression', icon: 'progress' },
  { href: '/records', label: 'Records', icon: 'record' },
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
    case 'session':
      return (
        <svg {...common}>
          <rect x="1.5" y="9.5" width="2.8" height="5" rx="1" />
          <rect x="5.2" y="7" width="3.4" height="10" rx="1.2" />
          <rect x="15.4" y="7" width="3.4" height="10" rx="1.2" />
          <rect x="19.7" y="9.5" width="2.8" height="5" rx="1" />
          <path d="M8.6 12h6.8" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...common}>
          <path d="M3 16.8 9 10.6l4 4L21 6.6" />
          <path d="M15 6.6h6v6" />
        </svg>
      );
    case 'record':
      return (
        <svg {...common}>
          <circle cx="12" cy="15" r="5.4" />
          <path d="M8.6 9.9 6 2.8h12l-2.6 7.1" />
          <path d="M12 12.8v4.4" />
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
