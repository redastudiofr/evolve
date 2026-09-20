'use client';

import { useRef } from 'react';

export type TestimonialItem = {
  name: string;
  context?: string;
  quote: string;
  rating?: number;
  placeholder?: boolean;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="quote__stars" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3.5 14.5 9l6 .8-4.4 4 1.2 5.9L12 16.9 6.7 19.7l1.2-5.9-4.4-4 6-.8L12 3.5Z"
            fill={i < rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('.quote--slide');
    const step = card ? card.clientWidth + 18 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  return (
    <div className="transform-wrap">
      <div className="testimonial-carousel" ref={railRef}>
        {items.map((t, i) => (
          <figure
            className={`quote quote--slide${t.placeholder ? ' quote--placeholder' : ''}`}
            key={i}
            data-reveal
            style={{ '--reveal-delay': `${(i % 4) * 70}ms` } as React.CSSProperties}
          >
            {t.placeholder ? <span className="quote__example-badge">Exemple</span> : null}

            {typeof t.rating === 'number' ? <Stars rating={t.rating} /> : null}

            <blockquote>
              <p>{t.quote}</p>
            </blockquote>
            <figcaption>
              <b>{t.name}</b>
              {t.context ? <span>{t.context}</span> : null}
            </figcaption>
          </figure>
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
