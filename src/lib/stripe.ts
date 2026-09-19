import Stripe from 'stripe';

export const TIERS = ['essential', 'elite'] as const;
export type Tier = (typeof TIERS)[number];

export function priceIdFor(tier: Tier): string | undefined {
  switch (tier) {
    case 'essential':
      return process.env.STRIPE_PRICE_ESSENTIAL;
    case 'elite':
      return process.env.STRIPE_PRICE_ELITE;
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
