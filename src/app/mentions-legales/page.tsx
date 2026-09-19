import Link from 'next/link';

export const metadata = { title: 'Mentions légales — Evolve' };

export default function MentionsLegales() {
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>Mentions légales</h1>
        <p>
          Ce document est un squelette juridique, pas un avis légal. Chaque champ entre
          crochets doit être complété avec tes informations réelles avant la mise en ligne.
        </p>

        <h2>Éditeur du site</h2>
        <p className="placeholder">
          [RAISON_SOCIALE] — [FORME_JURIDIQUE] au capital de [CAPITAL] € — RCS [VILLE] [NUMERO_SIRET]
          <br />Siège social : [ADRESSE_COMPLETE]
          <br />Numéro de TVA intracommunautaire : [TVA]
          <br />Directeur de la publication : [NOM_RESPONSABLE]
          <br />Contact : [CONTACT_EMAIL] — [TELEPHONE]
        </p>

        <h2>Hébergement</h2>
        <p className="placeholder">
          Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus de ce site (textes, méthode, guides, visuels) est la
          propriété d’Evolve, sauf mention contraire. Toute reproduction sans autorisation
          est interdite.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Le contenu proposé par Evolve est éducatif et informatif. Il ne remplace en aucun
          cas un avis médical, un diagnostic ou un suivi par un professionnel de santé.
          Consulte un médecin avant de débuter un programme d’entraînement ou de modifier
          ton alimentation, en particulier en cas de blessure, de pathologie ou de traitement
          en cours.
        </p>

        <h2>Droit applicable</h2>
        <p className="placeholder">[DROIT_APPLICABLE — ex. droit français — et juridiction compétente en cas de litige.]</p>
      </div>
    </main>
  );
}
