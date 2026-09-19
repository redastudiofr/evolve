import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import Faq from '@/components/Faq';
import IntroSplash from '@/components/IntroSplash';
import MobileNav from '@/components/MobileNav';
import TransformationsRail from '@/components/TransformationsRail';

const ICONS = (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <symbol id="i-logo" viewBox="0 0 24 24">
      <path d="M12 2 22 12 12 22 2 12 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7.5 16.5 12 12 16.5 7.5 12 12 7.5Z" fill="currentColor" opacity=".9" />
    </symbol>
    <symbol id="i-check" viewBox="0 0 24 24">
      <path d="M4.5 12.5 9.5 17.5 19.5 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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
    <symbol id="i-body" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V15m0 0-3.5 5.5M12 15l3.5 5.5M7.5 10.5h9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </symbol>
    <symbol id="i-mind" viewBox="0 0 24 24">
      <path d="M12 4a4 4 0 0 0-4 4v1a3 3 0 0 0 0 6v1a4 4 0 0 0 8 0v-1a3 3 0 0 0 0-6V8a4 4 0 0 0-4-4Zm0 0v16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-habits" viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5v3m8-3v3M3.5 10h17M8.5 14.5l2 2 4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-social" viewBox="0 0 24 24">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </symbol>
    <symbol id="i-business" viewBox="0 0 24 24">
      <path d="M4 20V10m6.5 10V4M17 20v-6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </symbol>
    <symbol id="i-chart" viewBox="0 0 24 24">
      <path d="M4 19h16M6 19V9m6 10V5m6 14v-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </symbol>
    <symbol id="i-target" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </symbol>
    <symbol id="i-sync" viewBox="0 0 24 24">
      <path d="M4 12a8 8 0 0 1 13.7-5.7M20 12a8 8 0 0 1-13.7 5.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 4v3.5h-3.5M7 20v-3.5h3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </symbol>
    <symbol id="i-ig" viewBox="0 0 24 24">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </symbol>
    <symbol id="i-play" viewBox="0 0 24 24">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </symbol>
  </svg>
);

const FAQ_ITEMS = [
  {
    q: 'À qui s’adresse Evolve ?',
    a: 'À toute personne qui veut transformer son physique et installer une vraie discipline, avec une méthode plutôt que des conseils épars. Elite s’adresse en plus à ceux qui veulent apprendre à construire une activité en ligne sur des bases solides.',
  },
  {
    q: 'Je pars de zéro, c’est adapté aux débutants ?',
    a: 'Oui. Le système part de ton point de départ réel — aucune base n’est supposée acquise, que ce soit à l’entraînement ou sur le volet discipline.',
  },
  {
    q: 'Comment fonctionne le coaching ?',
    a: 'Start te donne la méthode et l’application en autonomie, sans coaching individuel. [À confirmer précisément] : suivi périodique et ajustements du programme pour Essential ; suivi individuel plus rapproché avec accès direct et points réguliers pour Elite.',
  },
  {
    q: 'Combien de temps dure le programme ?',
    a: '[DUREE_PROGRAMME — à préciser : nombre de semaines/mois de la méthode, et si l’accès reste ouvert au-delà].',
  },
  {
    q: 'Comment fonctionne l’application ?',
    a: 'L’application centralise tes séances, ta progression, tes objectifs et tes habitudes. Elle te donne accès en continu à ton plan et à ton suivi, en complément du coaching.',
  },
  {
    q: 'Quelle est la différence entre Start, Essential et Elite ?',
    a: 'Start te donne la méthode complète en autonomie. Essential ajoute un vrai coaching et un suivi personnalisé — c’est l’offre la plus choisie. Elite inclut tout Essential, avec un accompagnement individuel plus poussé, le développement personnel, et un volet entrepreneuriat/réseaux sociaux. Elite n’est pas une promesse de revenu : c’est un accompagnement pour apprendre les compétences et la méthode.',
  },
  {
    q: 'Comment j’accède au programme après l’achat ?',
    a: '[ACCESS_DESCRIPTION — décrire précisément : lien de connexion à l’application, email de confirmation, délai d’accès.]',
  },
  {
    q: 'Que se passe-t-il après l’achat ?',
    a: 'Tu reçois un email de confirmation avec les instructions d’accès à l’application et à la formation. Le coaching démarre selon le rythme propre à ton offre.',
  },
  {
    q: 'Puis-je me faire rembourser ?',
    a: '[GUARANTEE_TERMS — politique de garantie à confirmer avant mise en ligne. Ne pas publier sans avoir validé la politique réelle.]',
  },
];

export default function Home() {
  return (
    <>
      {ICONS}
      <IntroSplash />

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
            <a className="nav__link" href="#transformations">Résultats</a>
            <a className="nav__link" href="#programmes">Programmes</a>
            <a className="nav__link" href="#faq">FAQ</a>
          </nav>

          <a className="btn btn--primary btn--sm nav__cta" href="#programmes">Rejoindre Evolve</a>

          <MobileNav />
        </div>
      </header>

      <main id="main">
        <span id="top" />

        {/* HERO */}
        <section className="hero">
          <div className="hero__media hero__media--mobile" aria-hidden="true">
            <Image src="/img/hero-gym-mobile.webp" alt="" fill priority sizes="100vw" />
          </div>
          <div className="hero__media hero__media--desktop" aria-hidden="true">
            <Image src="/img/hero-gym.webp" alt="" fill priority sizes="100vw" />
          </div>
          <div className="hero__scrim" />

          <div className="wrap hero__content">
            <p className="hero__badge">
              <span className="dot" aria-hidden="true" />
              Le système Evolve
            </p>

            <h1>
              Ton physique n&rsquo;est<br />que le point de départ.
            </h1>

            <p className="hero__sub">
              Entraînement, discipline, coaching et suivi réunis dans un seul système —
              pour construire un physique et une rigueur qui tiennent, pas un feu de paille
              de trois semaines.
            </p>

            <div className="hero__actions">
              <a className="btn btn--primary btn--tap" href="#programmes">
                Découvrir le système
                <svg className="btn__arrow" width="17" height="17" aria-hidden="true"><use href="#i-arrow" /></svg>
              </a>
              <a className="hero__link" href="#methode">Voir comment ça fonctionne</a>
            </div>
          </div>
        </section>

        {/* PITCH / VIDEO */}
        <section className="section pitch" id="decouvrir">
          <div className="wrap wrap--narrow">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Deux minutes pour tout comprendre</p>
              <h2>Voici exactement ce que tu obtiens.</h2>
              <p>La méthode, l&rsquo;application, le coaching — expliqués simplement, sans blabla marketing.</p>
            </header>

            <div className="pitch__video">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="pitch__video-play">
                  <svg width="20" height="20" aria-hidden="true"><use href="#i-play" /></svg>
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>Vidéo à venir</span>
              </div>
            </div>

            <div className="pitch__prices">
              <a className="pitch__price" href="#programmes">
                <span className="pitch__price-name">Start</span>
                <span className="pitch__price-amount">249,99&nbsp;€</span>
              </a>
              <a className="pitch__price pitch__price--featured" href="#programmes">
                <span className="pitch__price-name">Essential</span>
                <span className="pitch__price-amount">399,99&nbsp;€</span>
              </a>
              <a className="pitch__price pitch__price--elite" href="#programmes">
                <span className="pitch__price-name">Elite</span>
                <span className="pitch__price-amount">799,99&nbsp;€</span>
              </a>
            </div>

            <div className="pitch__cta">
              <a className="btn btn--primary btn--block btn--tap btn--glow" href="#programmes">
                Découvrir le système
                <svg className="btn__arrow" width="17" height="17" aria-hidden="true"><use href="#i-arrow" /></svg>
              </a>
            </div>

            <div className="pitch__badges">
              <span className="pitch__badge">
                <svg width="14" height="14" aria-hidden="true"><use href="#i-check" /></svg>
                Application incluse
              </span>
              <span className="pitch__badge">
                <svg width="14" height="14" aria-hidden="true"><use href="#i-check" /></svg>
                Coaching personnalisé
              </span>
              <span className="pitch__badge">
                <svg width="14" height="14" aria-hidden="true"><use href="#i-check" /></svg>
                Aucune expérience requise
              </span>
              <span className="pitch__badge">
                <svg width="14" height="14" aria-hidden="true"><use href="#i-check" /></svg>
                Accès immédiat après achat
              </span>
            </div>
          </div>
        </section>

        {/* TRANSFORMATIONS */}
        <section className="section" id="transformations">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Résultats réels</p>
              <h2>De vrais clients.<br />De vrais résultats.</h2>
              <p>Glisse pour comparer. De vraies transformations de clients accompagnés par Jim — à venir dans l&rsquo;ordre, ici même.</p>
            </header>

            <TransformationsRail />
          </div>
        </section>

        {/* FOUNDER */}
        <section className="section" id="fondateur">
          <div className="wrap founder__layout">
            <figure>
              <div className="portrait">
                <Image src="/img/founder-beach-1.webp" alt="Jim, fondateur d’Evolve" fill sizes="(max-width: 860px) 100vw, 500px" />
              </div>
            </figure>

            <div className="founder__body">
              <p className="eyebrow">Qui est derrière Evolve</p>
              <h2>Je n&rsquo;ai pas pris de raccourci.<br />Je n&rsquo;en vends pas non plus.</h2>

              <p>
                Jim a déjà accompagné de nombreuses personnes vers une meilleure version
                d&rsquo;elles-mêmes, physiquement et mentalement. Il partage sa méthode avec les
                11&nbsp;000 personnes qui le suivent, et Evolve est la version complète et
                structurée de cet accompagnement.
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
                <b>Jim</b>
                <a href="https://www.instagram.com/jimg.gg/" target="_blank" rel="noopener">
                  <svg width="15" height="15" aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 4 }}><use href="#i-ig" /></svg>
                  @jimg.gg · 11k
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* METHOD */}
        <section className="section" id="methode">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">Le système</p>
              <h2>Un seul système.<br />Six dimensions.</h2>
              <p>
                Evolve ne traite pas le physique comme un sujet isolé. Le système travaille en
                parallèle sur les dimensions qui, ensemble, créent une transformation qui dure.
              </p>
            </header>

            <div className="mod-grid">
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-body" /></svg></span>
                <h3>Physique</h3>
                <p>Le résultat visible de tout le reste.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-fitness" /></svg></span>
                <h3>Entraînement</h3>
                <p>Une méthode progressive, pas des séances au hasard.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-habits" /></svg></span>
                <h3>Discipline</h3>
                <p>Des habitudes qui tiennent, même les semaines difficiles.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-mind" /></svg></span>
                <h3>Développement personnel</h3>
                <p>La rigueur mentale qui soutient le physique.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-social" /></svg></span>
                <h3>Réseaux sociaux <span className="tier-badge">Elite</span></h3>
                <p>Ton image, ta présence, ta façon de te montrer.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-business" /></svg></span>
                <h3>Business <span className="tier-badge">Elite</span></h3>
                <p>Apprendre à construire une activité, pas à en rêver.</p>
              </article>
            </div>
          </div>
        </section>

        {/* PROGRAMS */}
        <section className="section" id="programmes">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Les trois niveaux d&rsquo;accompagnement</p>
              <h2>Choisis ton niveau d&rsquo;engagement.</h2>
              <p>Chaque niveau inclut tout le précédent, avec un accompagnement de plus en plus personnalisé.</p>
            </header>

            <div className="tiers">
              <article className="card tier">
                <header className="tier__head">
                  <h3 className="tier__name">Start</h3>
                  <p className="tier__for">Les bases essentielles pour commencer ta transformation avec une méthode claire et structurée.</p>
                </header>
                <div className="price"><span className="price__value">249,99&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Formation Evolve complète</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Accès à l&rsquo;application Evolve</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Programme d&rsquo;entraînement</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Méthode nutrition &amp; habitudes</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Objectifs et suivi de progression</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Accès aux ressources Evolve</li>
                </ul>
                <CheckoutButton tier="start" label="Rejoindre Start" variant="ghost" />
              </article>

              <article className="card tier tier--featured">
                <span className="tier__ribbon">Le plus choisi</span>
                <header className="tier__head">
                  <h3 className="tier__name">Essential</h3>
                  <p className="tier__for">Le système complet pour transformer ton physique, ta discipline et ta progression avec un accompagnement personnalisé.</p>
                </header>
                <div className="price"><span className="price__value">399,99&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><b>Tout le contenu de Start</b></li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Coaching &amp; accompagnement</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Programme d&rsquo;entraînement personnalisé</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Suivi de progression</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Ajustements réguliers</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Conseils entraînement &amp; progression</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Accompagnement habitudes &amp; discipline</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Échanges avec le coach</li>
                </ul>
                <CheckoutButton tier="essential" label="Rejoindre Essential" />
              </article>

              <article className="card tier tier--elite">
                <span className="tier__ribbon">Accompagnement complet</span>
                <header className="tier__head">
                  <h3 className="tier__name">Elite</h3>
                  <p className="tier__for">L&rsquo;accompagnement le plus complet pour progresser physiquement, personnellement et construire ton activité en ligne.</p>
                </header>
                <div className="price"><span className="price__value">799,99&nbsp;€</span></div>
                <p className="tier__terms">Paiement unique</p>
                <ul className="checklist tier__features">
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span><b>Tout Essential</b></li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Coaching plus personnalisé</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Suivi individuel plus approfondi</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Ajustements prioritaires</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Accompagnement développement personnel</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Coaching entrepreneuriat</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Stratégie réseaux sociaux</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Création de contenu</li>
                  <li><span className="check-icon"><svg width="12" height="12" aria-hidden="true"><use href="#i-check" /></svg></span>Construction d&rsquo;une activité en ligne, à ton rythme</li>
                </ul>
                <CheckoutButton tier="elite" label="Rejoindre Elite" />
                <p className="tier__note">Le volet business développe des compétences et une méthode de travail. Il ne constitue pas une promesse de revenu.</p>
              </article>
            </div>
          </div>
        </section>

        {/* VALUE STACK */}
        <section className="section" id="valeur">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Ce que tu obtiens réellement</p>
              <h2>Chaque élément a une valeur.<br />Ensemble, c&rsquo;est un système complet.</h2>
            </header>

            <div className="value-tiers">
              <div>
                <p className="value-tier-name">Start</p>
                <div className="value-list">
                  <div className="value-row"><span className="value-row__name">Formation</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Application</span><span className="value-row__amount">99&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Programme d&rsquo;entraînement</span><span className="value-row__amount">99&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Méthode nutrition &amp; habitudes</span><span className="value-row__amount">79&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Ressources Evolve</span><span className="value-row__amount">49&nbsp;€</span></div>
                  <div className="value-total"><b>Valeur indicative</b><span className="value-total__amount">475&nbsp;€</span></div>
                </div>
              </div>

              <div>
                <p className="value-tier-name value-tier-name--essential">Essential</p>
                <div className="value-list value-list--essential">
                  <div className="value-row"><span className="value-row__name">Formation</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Application</span><span className="value-row__amount">99&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Programme personnalisé</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Coaching &amp; accompagnement</span><span className="value-row__amount">249&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Suivi &amp; ajustements</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Méthode nutrition &amp; habitudes</span><span className="value-row__amount">79&nbsp;€</span></div>
                  <div className="value-total"><b>Valeur indicative</b><span className="value-total__amount">874&nbsp;€</span></div>
                </div>
              </div>

              <div>
                <p className="value-tier-name value-tier-name--elite">Elite</p>
                <div className="value-list value-list--elite">
                  <div className="value-row"><span className="value-row__name">Formation</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Application</span><span className="value-row__amount">99&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Programme personnalisé</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Coaching personnalisé</span><span className="value-row__amount">299&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Suivi approfondi</span><span className="value-row__amount">249&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Développement personnel</span><span className="value-row__amount">149&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Coaching entrepreneuriat</span><span className="value-row__amount">249&nbsp;€</span></div>
                  <div className="value-row"><span className="value-row__name">Stratégie réseaux &amp; contenu</span><span className="value-row__amount">299&nbsp;€</span></div>
                  <div className="value-total"><b>Valeur indicative</b><span className="value-total__amount">1&nbsp;642&nbsp;€</span></div>
                </div>
              </div>
            </div>

            <p className="disclaimer" style={{ textAlign: 'center', margin: '22px auto 0' }}>
              Valeur indicative des différents éléments inclus dans les offres.
            </p>
          </div>
        </section>

        {/* APP */}
        <section className="section" id="application">
          <div className="wrap">
            <header className="section-header">
              <p className="eyebrow">L&rsquo;outil qui fait la différence</p>
              <h2>Ce n&rsquo;est pas une formation.<br />C&rsquo;est un système que tu utilises chaque jour.</h2>
              <p>
                L&rsquo;application Evolve centralise tes séances, ta progression, tes objectifs et
                tes habitudes. Elle transforme la méthode en routine concrète, au lieu de rester une
                formation qu&rsquo;on regarde une fois et qu&rsquo;on oublie.
              </p>
            </header>

            <div className="mod-grid">
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-fitness" /></svg></span>
                <h3>Suivi des entraînements</h3>
                <p>Charges, séries, répétitions — séance après séance.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-chart" /></svg></span>
                <h3>Courbes de progression</h3>
                <p>Des chiffres, pas des impressions.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-target" /></svg></span>
                <h3>Objectifs personnalisés</h3>
                <p>Fixés avec toi, ajustés avec toi.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-habits" /></svg></span>
                <h3>Suivi des habitudes</h3>
                <p>La discipline devient visible, jour après jour.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-sync" /></svg></span>
                <h3>Statistiques de performance</h3>
                <p>Une vue d&rsquo;ensemble de ta progression réelle.</p>
              </article>
              <article className="mod">
                <span className="mod__icon"><svg width="17" height="17" aria-hidden="true"><use href="#i-target" /></svg></span>
                <h3>Suivi personnalisé</h3>
                <p>Reliée à ton coaching, pas un outil isolé.</p>
              </article>
            </div>
          </div>
        </section>

        {/* COACHING */}
        <section className="section" id="coaching">
          <div className="wrap wrap--narrow">
            <header className="section-header">
              <p className="eyebrow">L&rsquo;accompagnement</p>
              <h2>Un système, mais jamais seul.</h2>
            </header>
            <p>
              La méthode et l&rsquo;application structurent ton parcours ; le coaching l&rsquo;ajuste à
              ta réalité. Avec Start, tu avances en autonomie avec la méthode et l&rsquo;application.
              Avec Essential, ton suivi est périodique : ton programme est revu et ajusté régulièrement
              selon ta progression. Avec Elite, le suivi est individuel et plus rapproché, avec un accès
              direct pour poser tes questions et corriger le plan rapidement.
            </p>
            <p className="disclaimer" style={{ marginTop: 16 }}>
              [À préciser avant publication : fréquence exacte des points de suivi, format des appels
              Elite, délai de réponse. Ces détails engagent une vraie promesse de service — ne pas
              publier de chiffre non confirmé.]
            </p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section" id="temoignages">
          <div className="wrap">
            <header className="section-header section-header--center">
              <p className="eyebrow eyebrow--center">Avis clients</p>
              <h2>Ce qu&rsquo;en disent les membres.</h2>
            </header>

            <div className="rail">
              <figure className="quote">
                <div className="quote__pair">
                  <div className="quote__thumb">
                    <Image src="/img/transformation-1-mid.webp" alt="Lucas, avant" fill sizes="64px" />
                  </div>
                  <div className="quote__thumb">
                    <Image src="/img/transformation-1-after.webp" alt="Lucas, après" fill sizes="64px" />
                  </div>
                </div>
                <blockquote>
                  <p>Le suivi a fait toute la différence pour moi, surtout sur la régularité. J&rsquo;ai arrêté de tout recommencer à zéro à chaque fois.</p>
                </blockquote>
                <figcaption><b>Lucas</b><span>Programme Essential</span></figcaption>
              </figure>

              <figure className="quote">
                <div className="quote__avatar">
                  <Image src="/img/transformation-1-before.webp" alt="Nathan" fill sizes="64px" />
                </div>
                <blockquote>
                  <p>Bon franchement je m&rsquo;attendais pas à tenir aussi longtemps, mais le programme est plutôt clair donc ça aide.</p>
                </blockquote>
                <figcaption><b>Nathan</b><span>Programme Essential</span></figcaption>
              </figure>
            </div>

            <p className="disclaimer" style={{ textAlign: 'center', margin: '18px auto 0' }}>
              [À valider avec Lucas et Nathan avant publication : ce sont de vrais clients et de
              vraies photos, mais les citations ci-dessus sont un premier jet écrit pour illustrer
              le ton — à faire confirmer mot pour mot par chacun d&rsquo;eux.]
            </p>
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

        {/* FINAL CTA */}
        <section className="final">
          <div className="wrap">
            <h2>Le système existe.<br />Reste à choisir jusqu&rsquo;où tu vas.</h2>
            <div style={{ display: 'grid', gap: 14, maxWidth: 420, margin: '28px auto 0' }}>
              <CheckoutButton tier="start" label="Rejoindre Start — 249,99 €" variant="ghost" />
              <CheckoutButton tier="essential" label="Rejoindre Essential — 399,99 €" />
              <CheckoutButton tier="elite" label="Rejoindre Elite — 799,99 €" />
            </div>
            <p className="final__micro">Pas de raccourci · Pas de promesse irréaliste · Juste un système</p>
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
              <p className="footer__tagline">La discipline, transformée en système.</p>
            </div>

            <nav className="footer__col" aria-label="Programme">
              <h4>Programme</h4>
              <a href="#top">Accueil</a>
              <a href="#methode">Méthode</a>
              <a href="#programmes">Programmes</a>
              <a href="#transformations">Résultats</a>
            </nav>

            <nav className="footer__col" aria-label="Support">
              <h4>Support</h4>
              <a href="#faq">FAQ</a>
              <a href="#temoignages">Témoignages</a>
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
            <span>Contenu éducatif. Ne remplace pas un avis médical. Le volet business n&rsquo;est pas une promesse de revenu.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
