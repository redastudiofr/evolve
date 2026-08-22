'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import DataProvider from './DataProvider';
import TabBar from './TabBar';

function useServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        /* the app still works without offline support */
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useServiceWorker();

  if (pathname === '/login' || pathname === '/offline') return <>{children}</>;

  return (
    <DataProvider>
      <div className="shell">{children}</div>
      <TabBar />
    </DataProvider>
  );
}
