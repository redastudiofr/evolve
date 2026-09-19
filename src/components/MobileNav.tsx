'use client';

import { useState } from 'react';

const LINKS = [
  { href: '#methode', label: 'Méthode' },
  { href: '#programme', label: 'Programme' },
  { href: '#resultats', label: 'Résultats' },
  { href: '#tarifs', label: 'Tarifs' },
  { href: '#faq', label: 'FAQ' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="nav__toggle"
        type="button"
        aria-expanded={open}
        aria-label="Ouvrir le menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 68,
            background: 'var(--bg)',
            zIndex: 40,
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ fontSize: 22, fontWeight: 700 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#tarifs"
            className="btn btn--primary btn--block btn--tap"
            onClick={() => setOpen(false)}
            style={{ marginTop: 12 }}
          >
            Rejoindre Evolve
          </a>
        </div>
      ) : null}
    </>
  );
}
