'use client';

import { useEffect } from 'react';

// Repeating structural patterns that get the reveal treatment automatically,
// so every card grid across the site animates in without hand-tagging each one.
const AUTO_SELECTORS: { selector: string; kind?: string }[] = [
  { selector: '.section-header', kind: 'title' },
  { selector: '.mod-grid .mod' },
  { selector: '.tiers .tier' },
  { selector: '.value-tiers > div' },
];

/** Observes every [data-reveal] element on the page and flags it visible once it enters the viewport. */
export default function RevealInit() {
  useEffect(() => {
    AUTO_SELECTORS.forEach(({ selector, kind }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', kind ?? '');
        el.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
      });
    });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (reduced) {
      els.forEach((el) => el.setAttribute('data-visible', 'true'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
