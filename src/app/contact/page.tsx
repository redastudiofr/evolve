import Link from 'next/link';

export const metadata = { title: 'Contact — Evolve' };

export default function ContactPage() {
  return (
    <main className="page">
      <div className="wrap wrap--narrow">
        <Link className="back" href="/">← Retour à l’accueil</Link>
        <h1>Contact</h1>
        <p>
          Une question sur les programmes, le paiement ou ton accès à l’application ? Écris-nous,
          on te répond au plus vite.
        </p>

        <div className="contact-card">
          <a className="contact-card__item" href="mailto:[CONTACT_EMAIL]">
            <span className="contact-card__label">Email</span>
            <span>[CONTACT_EMAIL]</span>
          </a>
          <a className="contact-card__item" href="https://instagram.com/jimg.gg" target="_blank" rel="noreferrer">
            <span className="contact-card__label">Instagram</span>
            <span>@jimg.gg</span>
          </a>
        </div>

        <p className="page-note">On répond généralement sous 24 à 48h, du lundi au vendredi.</p>
      </div>
    </main>
  );
}
