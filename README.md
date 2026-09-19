# Evolve — le système (physique, discipline, business)

Site Next.js (App Router) avec paiement **Stripe Checkout** intégré directement
sur le site — pas de lien de paiement externe.

## Ce qui est déjà fait

- Page de vente complète en français : Hero avec photo, problème, méthode en 6
  dimensions, section transformations (slider avant/après réel, glisser pour
  comparer), les deux offres (Essential 399,99 € / Elite 799,99 €), stack de
  valeur, application Evolve, coaching, fondateur (Jim — @jimg.gg), témoignages,
  FAQ, CTA final.
- Bouton de paiement qui crée une vraie session Stripe Checkout côté serveur
  (`src/app/api/checkout/route.ts`) et redirige vers le paiement sécurisé Stripe.
- Pages `/success` et `/cancel` après paiement.
- Squelettes `/mentions-legales`, `/confidentialite`, `/cgv`.
- Composant `BeforeAfterSlider` (`src/components/BeforeAfterSlider.tsx`) :
  comparaison avant/après par glisser-déposer, tactile et souris, accessible au
  clavier (flèches gauche/droite), sans déformer les images.

## Ce qu'il reste à faire avant de vendre pour de vrai

Tout ce qui est écrit entre crochets `[...]` dans le code est un **placeholder** à
remplacer :

- **Histoire de Jim** (`src/app/page.tsx`, section `#fondateur`).
- **Nom et durée du client** affiché sous le slider avant/après (`#transformations`).
- **Témoignages écrits** (`#temoignages`) — actuellement des exemples clairement
  marqués comme tels, à remplacer uniquement par de vrais retours de membres
  ayant donné leur accord.
- **Valeurs en euros** de la stack de valeur (`#valeur`) — aucun chiffre n'est
  encore validé, ne rien publier sans les vrais montants.
- **Détails du coaching** (`#coaching`, et la FAQ) : fréquence exacte des
  suivis, format des appels Elite, durée du programme — engagent une vraie
  promesse de service.
- **Politique de garantie / remboursement** (`FAQ_ITEMS` dans `page.tsx`, et `cgv`).
- **Mentions légales, CGV, confidentialité** — squelettes juridiques à compléter
  et faire relire par un professionnel.
- **Email de contact**.
- Un deuxième (ou troisième) couple avant/après si tu veux enrichir la section
  transformations — voir `public/img/transformation-2-before.webp`, il manque
  la photo "après" correspondante.

## Configurer Stripe

1. Crée deux **produits** dans le [dashboard Stripe](https://dashboard.stripe.com/products),
   un par offre (Essential, Elite), chacun avec un prix associé.
2. Récupère l'ID de chaque prix (`price_...`).
3. Dans les paramètres du projet Vercel → **Environment Variables**, ajoute :

   | Variable | Valeur |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | ta clé secrète Stripe (`sk_live_...` ou `sk_test_...`) |
   | `STRIPE_PRICE_ESSENTIAL` | `price_...` de l'offre Essential |
   | `STRIPE_PRICE_ELITE` | `price_...` de l'offre Elite |

   Ces clés ne doivent **jamais** être commitées dans le code — elles ne vivent que
   dans les variables d'environnement Vercel (ou un `.env.local` non commité en dev).

4. Tant qu'une variable de prix n'est pas configurée, le bouton correspondant
   affiche une erreur propre au lieu de planter.

## Développement local

```bash
npm install
npm run dev
```

Crée un fichier `.env.local` (jamais commité, voir `.gitignore`) avec les mêmes
variables que ci-dessus pour tester les paiements en mode test Stripe.

## Déploiement

Le projet est déployé sur Vercel. Un simple `git push` sur la branche `main`
déclenche un nouveau déploiement.
