'use client';

import { useState } from 'react';
import type { Tier } from '@/lib/stripe';

export default function CheckoutButton({
  tier,
  label,
  variant = 'primary',
}: {
  tier: Tier;
  label: string;
  variant?: 'primary' | 'ghost';
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Une erreur est survenue.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Connexion impossible. Réessaie dans un instant.');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className={`btn btn--block btn--tap btn--${variant}${variant === 'primary' ? ' btn--aurora' : ''}`}
        onClick={handleClick}
        disabled={loading}
        data-checkout
      >
        {loading ? 'Redirection…' : label}
      </button>
      {error ? <p className="checkout-error">{error}</p> : null}
    </div>
  );
}
