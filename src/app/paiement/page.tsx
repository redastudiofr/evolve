import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import type { Tier } from '@/lib/stripe';

export const metadata = { title: 'Paiement — Evolve' };

const TIERS_INFO: Record<Tier, { name: string; price: string; tagline: string; features: string[] }> = {
  start: {
    name: 'Start',
    price: '249,99 €',
    tagline: 'Les bases essentielles pour commencer ta transformation avec une méthode claire et structurée.',
    features: [
      'Formation Evolve complète',
      'Accès à l’application Evolve',
      'Programme d’entraînement',
      'Méthode nutrition & habitudes',
      'Objectifs et suivi de progression',
      'Accès aux ressources Evolve',
    ],
  },
  essential: {
    name: 'Essential',
    price: '399,99 €',
    tagline: 'Le système complet pour transformer ton physique, ta discipline et ta progression avec un accompagnement personnalisé.',
    features: [
      'Tout le contenu de Start',
      'Coaching & accompagnement',
      'Programme d’entraînement personnalisé',
      'Suivi de progression',
      'Ajustements réguliers',
      'Échanges avec le coach',
    ],
  },
  elite: {
    name: 'Elite',
    price: '799,99 €',
    tagline: 'L’accompagnement le plus complet pour progresser physiquement, personnellement et construire ton activité en ligne.',
    features: [
      'Tout Essential',
      'Coaching plus personnalisé',
      'Suivi individuel plus approfondi',
      'Accompagnement développement personnel',
      'Coaching entrepreneuriat',
      'Stratégie réseaux sociaux',
    ],
  },
};

function isTier(value: string | undefined): value is Tier {
  return !!value && value in TIERS_INFO;
}

export default async function PaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier } = await searchParams;
  const selected = isTier(tier) ? tier : undefined;

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>

        {selected ? (
          <>
            <h1>Finalise ta commande</h1>
            <p>Tu es sur le point de rejoindre le programme <b>{TIERS_INFO[selected].name}</b>.</p>

            <div className="card payment-recap">
              <h2>{TIERS_INFO[selected].name} — {TIERS_INFO[selected].price}</h2>
              <p>{TIERS_INFO[selected].tagline}</p>
              <ul className="payment-recap__features">
                {TIERS_INFO[selected].features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="payment-recap__note">Paiement unique, sécurisé par Stripe. Tu es redirigé vers une page de paiement Stripe pour entrer tes informations bancaires.</p>
              <div className="payment-recap__cta">
                <CheckoutButton tier={selected} label={`Payer maintenant — ${TIERS_INFO[selected].price}`} />
              </div>
            </div>

            <p className="page-note">
              Tu hésites encore ? <Link href="/paiement">Voir les autres offres</Link>.
            </p>
          </>
        ) : (
          <>
            <h1>Choisis ton offre</h1>
            <p>Sélectionne le niveau d’accompagnement avant de passer au paiement.</p>

            <div className="payment-tiers">
              {(Object.keys(TIERS_INFO) as Tier[]).map((key) => (
                <Link key={key} href={`/paiement?tier=${key}`} className="card payment-tier">
                  <h2>{TIERS_INFO[key].name} — {TIERS_INFO[key].price}</h2>
                  <p>{TIERS_INFO[key].tagline}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
