'use client';

import { useRef } from 'react';

export default function TransformationsRail({ slots = 3 }: { slots?: number }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <div className="transform-wrap">
      <div className="transform-rail" ref={railRef}>
        {Array.from({ length: slots }).map((_, i) => (
          <div className="transform-slot" key={i}>
            <span>Photo à venir</span>
          </div>
        ))}
      </div>
      <div className="transform-nav">
        <button type="button" aria-label="Précédent" onClick={() => scrollBy(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label="Suivant" onClick={() => scrollBy(1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
