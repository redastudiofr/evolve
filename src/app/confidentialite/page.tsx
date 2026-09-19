import Link from 'next/link';

export const metadata = { title: 'Politique de confidentialité — Evolve' };

export default function Confidentialite() {
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>Politique de confidentialité</h1>
        <p>
          Ce document est un squelette, pas un avis juridique. À compléter et à faire
          relire avant publication, notamment au regard du RGPD si tu vends à des
          résidents de l’Union européenne.
        </p>

        <h2>Données collectées</h2>
        <p>
          Lors d’un achat, Stripe (notre prestataire de paiement) collecte les informations
          nécessaires à la transaction (email, informations de paiement). Evolve ne stocke
          jamais tes coordonnées bancaires.
        </p>
        <p className="placeholder">
          [Complète ici si tu collectes d’autres données : formulaire de contact, newsletter,
          création de compte, etc.]
        </p>

        <h2>Utilisation des données</h2>
        <p>
          Les données transmises via Stripe sont utilisées uniquement pour traiter ta
          commande et t’envoyer la confirmation d’accès au programme.
        </p>

        <h2>Cookies et mesure d’audience</h2>
        <p className="placeholder">
          [Aucun outil d’analyse n’est installé par défaut. Si tu ajoutes Plausible, Google
          Analytics ou un pixel Meta, décris ici précisément ce qui est collecté et mets en
          place un bandeau de consentement si la loi l’exige.]
        </p>

        <h2>Conservation et droits</h2>
        <p className="placeholder">
          [DUREE_CONSERVATION]. Conformément au RGPD, tu peux demander l’accès, la
          rectification ou la suppression de tes données en écrivant à
          [CONTACT_EMAIL].
        </p>
      </div>
    </main>
  );
}
