import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import Faq from '@/components/Faq';
import MobileNav from '@/components/MobileNav';

const ICONS = (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <symbol id="i-logo" viewBox="0 0 24 24">
      <path d="M12 2 22 12 12 22 2 12 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" fill="currentColor" opacity=".9" />
    </symbol>
    <symbol id="i-check" viewBox="0 0 24 24">
      <path d="M4.5 12.5 9.5 17.5 19.5 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-cross" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24">
      <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-info" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.5M12 7.8v.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </symbol>
    <symbol id="i-fitness" viewBox="0 0 24 24">
      <path d="M4 9v6m16-6v6M7 6.5v11m10-11v11M7 12h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </symbol>
    <symbol id="i-nutrition" viewBox="0 0 24 24">
      <path d="M19.5 5C13 4.5 7.5 7 6 12.5 5 16.3 6.6 19 8.5 20c3-4.8 5.8-7.3 9-9.2M6.8 20c-.8-4 1-8 5-10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-sleep" viewBox="0 0 24 24">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-chart" viewBox="0 0 24 24">
      <path d="M4 20V10m6.5 10V4M17 20v-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </symbol>
    <symbol id="i-mind" viewBox="0 0 24 24">
      <path d="M12 4a4 4 0 0 0-4 4v1a3 3 0 0 0 0 6v1a4 4 0 0 0 8 0v-1a3 3 0 0 0 0-6V8a4 4 0 0 0-4-4Zm0 0v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-community" viewBox="0 0 24 24">
      <circle cx="9" cy="8.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2M16 9a2.6 2.6 0 1 0 0-5.2M18.5 19c0-2.4-1.7-4.4-4-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </symbol>
    <symbol id="i-habits" viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5v3m8-3v3M3.5 10h17M8.5 14.5l2 2 4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-mobility" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V15m0 0-3 5.5M12 15l3 5.5M8 10.5h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </symbol>
  </svg>
);

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce qu'Evolve ?",
    a: 'Un programme structuré de musculation et de remise en forme : un plan d’entraînement progressif, une méthode nutrition simple à tenir, et un suivi pour ajuster au fil des semaines. L’objectif est de te donner une méthode claire, pas une liste de conseils épars.',
  },
  {
    q: 'Je pars de zéro, est-ce que c’est pour moi ?',
    a: 'Oui. La phase 1 (Bilan & fondations) part du principe que tu n’as aucune base : elle couvre la technique, la posture et les repères avant d’augmenter la charge de travail.',
  },
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: 'Les premiers repères (force, énergie, régularité) apparaissent en 2 à 4 semaines. Les changements visibles prennent généralement 8 à 12 semaines, selon ton point de départ et ta régularité — il n’y a pas de raccourci honnête à annoncer ici.',
  },
  {
    q: 'Faut-il une salle de sport ?',
    a: "Le programme est conçu pour une salle classique, mais chaque séance indique une alternative à charge réduite (élastiques, poids du corps, matériel limité). [ACCESS_DESCRIPTION — précise ici si une version 100% maison est proposée.]",
  },
  {
    q: 'Comment se passe le paiement ?',
    a: 'Le paiement est sécurisé par Stripe, directement sur ce site. Aucune donnée bancaire ne transite ailleurs. Tu reçois ta confirmation d’accès par email juste après.',
  },
  {
    q: "Je peux me faire rembourser si ça ne me convient pas ?",
    a: '[GUARANTEE_TERMS — à confirmer avant mise en ligne : par exemple “Garantie satisfait ou remboursé sous 14 jours si tu as suivi le programme sans résultat”. Ne pas publier sans avoir validé la politique réelle.]',
  },
  {
    q: 'Quelle offre choisir ?',
    a: 'Essentiel si tu es autonome et que tu veux juste la méthode. Evolve si tu veux le système complet avec suivi et ajustements — c’est l’offre que la majorité des membres choisissent. Privé uniquement si tu veux un accompagnement individuel avec accès direct.',
  },
];

export default function Home() {
  return (
    <>
      {ICONS}

      <header className="nav">
        <div className="wrap nav__inner">
          <Link className="logo" href="#top">
            <svg className="logo__mark" aria-hidden="true">
              <use href="#i-logo" />
            </svg>
            <span>Evolve</span>
          </Link>

          <nav className="nav__links" aria-label="Navigation principale">
            <a className="nav__link" href="#methode">Méthode</a>
            <a className="nav__link" href="#programme">Programme</a>
            <a className="nav__link" href="#resultats">Résultats</a>
            <a className="nav__link" href="#faq">FAQ</a>
          </nav>

          <a className="btn btn--primary btn--sm nav__cta" href="#tarifs">Rejoindre Evolve</a>

          <MobileNav />
        </div>
      </header>

      <main id="main">
        <span id="top" />

        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <p className="hero__badge">
              <span className="dot" aria-hidden="true" />
              La méthode Evolve
            </p>

            <h1>
              Transforme ton corps.<br />
              Arrête de <em>recommencer</em> chaque lundi.
            </h1>

            <p className="hero__sub">
              Entraînement, nutrition et suivi réunis dans une méthode en 5 étapes,
              pensée pour tenir sur des mois — pas sur trois semaines de motivation.
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary btn--tap" href="#tarifs">
                Commencer ma transformation
                <svg className="btn__arrow" width="17" height="17" aria-hidden="true"><use href="#i-arrow" /></svg>
              </a>
              <a className="hero__link" href="#methode">Voir la méthode en 5 étapes</a>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <b>5</b>
                <span>étapes structurées</span>
              </div>
              <div className="hero__stat">
                <b>10</b>
                <span>domaines couverts</span>
              </div>
              <div className="hero__stat">
                <b>100%</b>
                <span>en ligne, à ton rythme</span>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span className="marquee__item">Discipline</span>
                <span className="marquee__item">Force</span>
                <span className="marquee__item">Nutrition</span>
                <span className="marquee__item">Régularité</span>
                <span className="marquee__item">Récupération</span>
                <span className="marquee__item">Progression</span>
                <span className="marquee__item">Méthode</span>
              </span>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <section className="section" id="probleme">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">Le point de départ</p>
              <h2>Ce n’est pas ta volonté.<br />C’est l’absence de méthode.</h2>
            </header>

            <div className="mini-grid">
              <article className="mini">
                <span className="mini__num">01</span>
                <h3>Tu ne sais pas par où commencer</h3>
                <p>Vingt avis différents. Zéro première étape claire.</p>
              </article>
              <article className="mini">
                <span className="mini__num">02</span>
                <h3>Motivé trois semaines, puis plus rien</h3>
                <p>À fond au début, à l’arrêt dès le premier imprévu.</p>
              </article>
              <article className="mini">
                <span className="mini__num">03</span>
                <h3>Des séances sans structure</h3>
                <p>Tu t’entraînes, mais sans savoir si tu progresses vraiment.</p>
              </article>
              <article className="mini">
                <span className="mini__num">04</span>
                <h3>Une alimentation ingérable</h3>
                <p>Trop stricte pour durer, ou trop floue pour avoir un effet.</p>
              </article>
              <article className="mini">
                <span className="mini__num">05</span>
                <h3>Aucun suivi réel</h3>
                <p>Pas de chiffres, pas de repères : impossible de savoir ce qui marche.</p>
              </article>
              <article className="mini">
                <span className="mini__num">06</span>
                <h3>Le yo-yo permanent</h3>
                <p>Des résultats gagnés, puis reperdus, faute de routine stable.</p>
              </article>
            </div>
          </div>
        </section>

        {/* METHOD */}
        <section className="section" id="methode">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">La méthode</p>
              <h2>5 étapes.<br />Dans cet ordre, pas un autre.</h2>
            </header>

            <ol className="method__list">
              <li className="step">
                <span className="step__num">01</span>
                <div className="step__body">
                  <h3>Bilan &amp; objectifs</h3>
                  <p>Point de départ réel, contraintes de temps et de matériel, objectif chiffré et réaliste.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__num">02</span>
                <div className="step__body">
                  <h3>Fondations techniques</h3>
                  <p>Les mouvements de base, la bonne exécution, la mobilité — avant d’ajouter de la charge.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__num">03</span>
                <div className="step__body">
                  <h3>Entraînement progressif</h3>
                  <p>Un programme qui monte en charge semaine après semaine, adapté à ton niveau et ton matériel.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__num">04</span>
                <div className="step__body">
                  <h3>Nutrition tenable</h3>
                  <p>Des repères simples, pas un régime strict — une alimentation que tu peux suivre toute l’année.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__num">05</span>
                <div className="step__body">
                  <h3>Suivi &amp; ajustements</h3>
                  <p>Mesures, photos, performances : on ajuste le plan selon ce qui se passe réellement, pas sur une hypothèse figée.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* PROGRAM */}
        <section className="section" id="programme">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">À l’intérieur</p>
              <h2>10 domaines.<br />Un seul système.</h2>
            </header>

            <div className="mod-grid">
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-fitness" /></svg></span>
                <h3>Musculation</h3>
                <p>Programme progressif, adapté salle ou maison.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-nutrition" /></svg></span>
                <h3>Nutrition</h3>
                <p>Des repères simples, pas un régime rigide.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-mobility" /></svg></span>
                <h3>Mobilité</h3>
                <p>Corriger les déséquilibres avant qu’ils ne bloquent.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-sleep" /></svg></span>
                <h3>Récupération &amp; sommeil</h3>
                <p>Ce qui fait progresser réellement entre les séances.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-chart" /></svg></span>
                <h3>Suivi des performances</h3>
                <p>Charges, mesures, photos — des chiffres, pas des impressions.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-mind" /></svg></span>
                <h3>Mental &amp; discipline</h3>
                <p>Tenir sur la durée, y compris les semaines difficiles.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-habits" /></svg></span>
                <h3>Habitudes quotidiennes</h3>
                <p>La routine qui fait tenir tout le reste ensemble.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-community" /></svg></span>
                <h3>Communauté</h3>
                <p>[COMMUNITY_DESCRIPTION — décrire le groupe privé si tu en proposes un.]</p>
              </article>
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="section" id="fondateur">
          <div className="wrap founder__layout">
            <figure>
              <div className="portrait">
                <div className="ph">
                  <div>
                    <span className="ph__label">Ajoute ta photo</span>
                    <span className="ph__hint">[FOUNDER_PHOTO]</span>
                  </div>
                </div>
              </div>
            </figure>

            <div className="founder__body">
              <p className="eyebrow">Qui est derrière Evolve</p>
              <h2>Je n’ai pas pris de raccourci.<br />Je n’en vends pas non plus.</h2>

              <p>
                [FOUNDER_STORY — deux ou trois phrases : d’où tu pars, ce qui a changé, combien de
                temps ça t’a pris. Du concret plutôt que de l’impressionnant : c’est ce que les gens
                lisent avant de faire confiance à la méthode.]
              </p>

              <ul className="founder__principles">
                <li>
                  <span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>
                  <span><b>La méthode avant la motivation.</b></span>
                </li>
                <li>
                  <span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>
                  <span><b>La régularité avant le volume.</b></span>
                </li>
                <li>
                  <span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>
                  <span><b>Des délais honnêtes.</b></span>
                </li>
              </ul>

              <p className="founder__sign">
                <b>[FOUNDER_NAME]</b>
              </p>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section className="section" id="resultats">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow">Résultats</p>
              <h2>Uniquement des vrais.</h2>
              <p>Ces emplacements sont réservés à de vraies photos avant/après de membres ayant donné leur accord.</p>
            </header>

            <div className="note">
              <svg width="17" height="17" aria-hidden="true"><use href="#i-info" /></svg>
              <span>
                <strong>Section à compléter.</strong> Remplace chaque cadre par une vraie photo et
                chaque citation par un vrai témoignage avant publication — rien ici n’est un retour réel.
              </span>
            </div>

            <div className="rail">
              {[1, 2, 3].map((n) => (
                <article className="result-card" key={n}>
                  <div className="result-card__pair">
                    <div className="ph"><span className="tag">Avant</span><div><span className="ph__label">Photo</span><span className="ph__hint">[BEFORE_PHOTO_{n}]</span></div></div>
                    <div className="ph"><span className="tag tag--after">Après</span><div><span className="ph__label">Photo</span><span className="ph__hint">[AFTER_PHOTO_{n}]</span></div></div>
                  </div>
                  <div className="result-card__caption"><b>[MEMBRE_{n}]</b><span>[DUREE_{n}]</span></div>
                </article>
              ))}
            </div>

            <div className="rail" style={{ marginTop: '.9rem' }}>
              {[1, 2, 3].map((n) => (
                <figure className="quote" key={n}>
                  <blockquote><p>[TEMOIGNAGE_{n} — exemple à remplacer par un vrai retour de membre]</p></blockquote>
                  <figcaption><b>[NOM_{n}]</b><span>[CONTEXTE_{n}]</span></figcaption>
                </figure>
              ))}
            </div>

            <p className="disclaimer">
              Les résultats dépendent de la régularité avec laquelle la méthode est appliquée et
              varient d’une personne à l’autre. Evolve est un contenu éducatif : il ne remplace pas
              un avis médical. Consulte un professionnel de santé avant de débuter un programme
              d’entraînement ou de modifier ton alimentation, en particulier en cas de blessure,
              de pathologie ou de traitement en cours.
            </p>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="section" id="inclus">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">Ce que tu reçois</p>
              <h2>Tu ouvres. Tu suis.</h2>
            </header>

            <ul className="get-list">
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>La méthode Evolve</b><span>5 étapes, dans l’ordre.</span></div></li>
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>Programme d’entraînement</b><span>Progressif, sur plusieurs semaines.</span></div></li>
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>Guide nutrition</b><span>Des repères simples à tenir.</span></div></li>
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>Checklists</b><span>Quotidiennes et hebdomadaires.</span></div></li>
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>Outils de suivi</b><span>Charges, mesures, photos de progression.</span></div></li>
              <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><div><b>Mises à jour</b><span>[UPDATES_DESCRIPTION]</span></div></li>
            </ul>
          </div>
        </section>

        {/* WHO FOR */}
        <section className="section" id="pour-qui">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Est-ce pour toi</p>
              <h2>Pas fait pour tout le monde.</h2>
            </header>

            <div className="audience">
              <article className="card audience__card">
                <div className="audience__head">
                  <span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>
                  <h3>C’est pour toi si…</h3>
                </div>
                <ul className="checklist">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Tu veux un plan clair, pas vingt avis contradictoires.</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Tu es prêt à t’engager sur plusieurs mois.</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Tu veux progresser même les semaines chargées.</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Tu préfères des résultats durables à un effet rapide.</li>
                </ul>
              </article>

              <article className="card audience__card">
                <div className="audience__head">
                  <span className="cross-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-cross" /></svg></span>
                  <h3>Ce n’est pas pour toi si…</h3>
                </div>
                <ul className="checklist">
                  <li><span className="cross-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-cross" /></svg></span>Tu cherches un résultat en une semaine.</li>
                  <li><span className="cross-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-cross" /></svg></span>Tu ne veux changer aucune habitude.</li>
                  <li><span className="cross-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-cross" /></svg></span>Tu vas lire le programme sans l’appliquer.</li>
                  <li><span className="cross-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-cross" /></svg></span>Tu recherches un avis médical ou un suivi de pathologie.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="wrap wrap--narrow">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Questions</p>
              <h2>Avant de te lancer.</h2>
            </header>

            <Faq items={FAQ_ITEMS} />
          </div>
        </section>

        {/* PRICING */}
        <section className="section pricing" id="tarifs">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Tarifs</p>
              <h2>Commence ta transformation</h2>
              <p>Paiement unique. Sans abonnement.</p>
            </header>

            <div className="tiers">
              <article className="card tier">
                <header className="tier__head">
                  <h3 className="tier__name">Essentiel</h3>
                  <p className="tier__for">La méthode, en autonomie.</p>
                </header>
                <div className="price"><span className="price__value">97&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>La méthode en 5 étapes</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Programme d’entraînement complet</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Guide nutrition</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Checklists quotidiennes</li>
                </ul>
                <CheckoutButton tier="essentiel" label="Choisir Essentiel" variant="ghost" />
              </article>

              <article className="card tier tier--featured">
                <span className="tier__ribbon">Le plus choisi</span>
                <header className="tier__head">
                  <h3 className="tier__name">Evolve</h3>
                  <p className="tier__for">Le système complet.</p>
                </header>
                <div className="price"><span className="price__value">297&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><b>Tout Essentiel</b></li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Suivi hebdomadaire de tes progrès</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Ajustements du programme</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Outils de suivi — J0 / J30 / J60 / J90</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Communauté privée</li>
                </ul>
                <CheckoutButton tier="evolve" label="Rejoindre Evolve" />
              </article>

              <article className="card tier">
                <header className="tier__head">
                  <h3 className="tier__name">Privé</h3>
                  <p className="tier__for">Sur mesure, avec accès direct.</p>
                </header>
                <div className="price"><span className="price__value">890&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><b>Tout Evolve</b></li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Bilan personnalisé de ton point de départ</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Appel d’onboarding ([CALL_DURATION])</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Accès direct pendant [SUPPORT_DURATION]</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Point mensuel</li>
                </ul>
                <CheckoutButton tier="private" label="Postuler pour Privé" variant="ghost" />
                <p className="tier__note">Places limitées à [SPOTS_PER_MONTH] par mois</p>
              </article>
            </div>

            <p className="pricing__foot">Paiement sécurisé par Stripe · Sans abonnement</p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final">
          <div className="wrap">
            <h2>Ta transformation<br />commence maintenant.</h2>
            <a className="btn btn--primary btn--block btn--tap" href="#tarifs">
              Rejoindre Evolve
              <svg className="btn__arrow" width="17" height="17" aria-hidden="true"><use href="#i-arrow" /></svg>
            </a>
            <p className="final__micro">Pas de raccourci · Pas de recette miracle · Juste une méthode</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div>
              <a className="logo" href="#top">
                <svg className="logo__mark" aria-hidden="true"><use href="#i-logo" /></svg>
                <span>Evolve</span>
              </a>
              <p className="footer__tagline">Musculation, nutrition, suivi — une méthode pour tenir dans la durée.</p>
            </div>

            <nav className="footer__col" aria-label="Programme">
              <h4>Programme</h4>
              <a href="#top">Accueil</a>
              <a href="#methode">Méthode</a>
              <a href="#programme">Programme</a>
              <a href="#tarifs">Tarifs</a>
            </nav>

            <nav className="footer__col" aria-label="Support">
              <h4>Support</h4>
              <a href="#faq">FAQ</a>
              <a href="#resultats">Résultats</a>
              <a href="mailto:[CONTACT_EMAIL]">Contact</a>
            </nav>

            <nav className="footer__col" aria-label="Légal">
              <h4>Légal</h4>
              <a href="/cgv">CGV</a>
              <a href="/confidentialite">Confidentialité</a>
              <a href="/mentions-legales">Mentions légales</a>
            </nav>
          </div>

          <div className="footer__bottom">
            <span>&copy; {new Date().getFullYear()} Evolve. Tous droits réservés.</span>
            <span>Contenu éducatif. Ne remplace pas un avis médical.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
