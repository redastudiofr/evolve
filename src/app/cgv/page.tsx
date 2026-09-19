import Link from 'next/link';

export const metadata = { title: 'Conditions générales de vente — Evolve' };

export default function CGV() {
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>Conditions générales de vente</h1>
        <p>
          Ce document est un squelette, pas un avis juridique. À faire relire par un
          professionnel avant toute mise en ligne — la vente d’une formation en ligne à des
          particuliers en France est encadrée par le droit de la consommation.
        </p>

        <h2>Objet</h2>
        <p>
          Les présentes conditions régissent la vente des programmes Evolve (Essentiel,
          Evolve, Privé) proposés sur ce site.
        </p>

        <h2>Prix et paiement</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. Le paiement s’effectue en
          une fois, de manière sécurisée, via Stripe.
        </p>

        <h2>Droit de rétractation</h2>
        <p className="placeholder">
          [À COMPLETER — pour un contenu numérique fourni immédiatement, la loi impose
          des mentions spécifiques sur la renonciation au droit de rétractation. Ne publie
          pas cette section sans validation juridique.]
        </p>

        <h2>Garantie</h2>
        <p className="placeholder">[GUARANTEE_TERMS — même remarque que sur la page tarifs : ne pas publier sans avoir confirmé la politique réelle.]</p>

        <h2>Accès au programme</h2>
        <p className="placeholder">[ACCESS_DESCRIPTION — modalités et délai de livraison de l’accès après paiement.]</p>

        <h2>Contact</h2>
        <p>Pour toute question relative à une commande : <a href="mailto:[CONTACT_EMAIL]">[CONTACT_EMAIL]</a>.</p>
      </div>
    </main>
  );
}
