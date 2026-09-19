'use client';

import { useRef } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

export type Transformation = {
  before: string;
  after: string;
  name: string;
  context?: string;
};

export default function TransformationsCarousel({ items }: { items: Transformation[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('.ba-slide');
    const step = card ? card.clientWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  if (items.length === 0) return null;
  const solo = items.length === 1;

  return (
    <div className="transform-wrap">
      <div className={`transform-carousel${solo ? ' transform-carousel--solo' : ''}`} ref={railRef}>
        {items.map((item, i) => (
          <figure className={`ba-slide${solo ? ' ba-slide--solo' : ''}`} key={i}>
            <BeforeAfterSlider before={item.before} after={item.after} />
            <figcaption className="ba-slide__caption">
              <b>{item.name}</b>
              {item.context ? <span>{item.context}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length > 1 ? (
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
      ) : null}
    </div>
  );
}
