'use client';

import { useEffect, useState } from 'react';

export default function IntroSplash() {
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('done');
      return;
    }
    const outTimer = setTimeout(() => setPhase('out'), 700);
    const doneTimer = setTimeout(() => setPhase('done'), 1150);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className="intro" data-phase={phase} aria-hidden="true">
      <svg className="intro__mark" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 22 12 12 22 2 12 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" fill="currentColor" opacity=".9" />
      </svg>
      <span className="intro__word">Evolve</span>
    </div>
  );
}
