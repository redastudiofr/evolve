import Link from 'next/link';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

async function getSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await getSession(session_id);
  const paid = session?.payment_status === 'paid';

  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>{paid ? 'Paiement confirmé — bienvenue dans Evolve.' : 'Merci pour ta commande.'}</h1>
        <p>
          {paid
            ? 'Ton paiement a bien été reçu. Tu vas recevoir un email de confirmation avec les instructions d’accès.'
            : 'Nous finalisons la vérification de ton paiement. Si tu ne reçois rien sous quelques minutes, contacte-nous.'}
        </p>
        <p>
          [ACCESS_DESCRIPTION — décris ici précisément ce que le membre reçoit : lien vers le
          contenu, identifiants, délai. Cette page doit être complétée avant la mise en ligne.]
        </p>
        <p>
          Une question ? Écris-nous à <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.
        </p>
      </div>
    </main>
  );
}
