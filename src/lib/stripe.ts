import Stripe from 'stripe';

export const TIERS = ['essentiel', 'evolve', 'private'] as const;
export type Tier = (typeof TIERS)[number];

export function priceIdFor(tier: Tier): string | undefined {
  switch (tier) {
    case 'essentiel':
      return process.env.STRIPE_PRICE_ESSENTIEL;
    case 'evolve':
      return process.env.STRIPE_PRICE_EVOLVE;
    case 'private':
      return process.env.STRIPE_PRICE_PRIVATE;
  }
}

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (!cached) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY manquante.');
    cached = new Stripe(key);
  }
  return cached;
}
