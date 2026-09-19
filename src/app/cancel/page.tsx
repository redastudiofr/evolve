import Link from 'next/link';

export default function CancelPage() {
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>Paiement annulé</h1>
        <p>
          Ta commande n’a pas été finalisée et aucun montant n’a été débité. Tu peux
          réessayer quand tu veux.
        </p>
        <Link className="btn btn--primary" href="/#tarifs" style={{ marginTop: 24, display: 'inline-flex' }}>
          Revenir aux tarifs
        </Link>
      </div>
    </main>
  );
}
