import { NextRequest, NextResponse } from 'next/server';
import { getStripe, priceIdFor, TIERS, type Tier } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  let body: { tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const tier = body.tier as Tier | undefined;
  if (!tier || !TIERS.includes(tier)) {
    return NextResponse.json({ error: 'Offre inconnue.' }, { status: 400 });
  }

  const priceId = priceIdFor(tier);
  if (!priceId) {
    return NextResponse.json(
      { error: "Cette offre n'est pas encore configurée côté paiement." },
      { status: 503 },
    );
  }

  const origin = req.headers.get('origin') ?? new URL(req.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Impossible de créer la session de paiement.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return NextResponse.json({ error: 'Le paiement est momentanément indisponible.' }, { status: 500 });
  }
}
