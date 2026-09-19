# Evolve — le système (physique, discipline, business)

Site Next.js (App Router) avec paiement **Stripe Checkout** intégré directement
sur le site — pas de lien de paiement externe.

## Ce qui est déjà fait

- Page de vente complète en français : Hero avec photo, pitch vidéo, méthode en 6
  dimensions, section transformations (carrousel avant/après), les trois offres
  (Start 249,99 € / Essential 399,99 € / Elite 799,99 €), stack de valeur détaillée
  par offre, application Evolve, coaching, fondateur (Jim — @jimg.gg), avis
  clients, FAQ, CTA final.
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
- **Citations des avis clients** (`#temoignages`) — Lucas et Nathan sont de vrais
  clients avec de vraies photos, mais les citations sont un premier jet à faire
  valider mot pour mot avec chacun avant publication.
- **Détails du coaching** (`#coaching`, et la FAQ) : fréquence exacte des
  suivis, format des appels Elite, durée du programme — engagent une vraie
  promesse de service.
- **Politique de garantie / remboursement** (`FAQ_ITEMS` dans `page.tsx`, et `cgv`).
- **Mentions légales, CGV, confidentialité** — squelettes juridiques à compléter
  et faire relire par un professionnel.
- **Email de contact**.
- Un deuxième couple avant/après si tu veux enrichir le carrousel transformations
  — voir `public/img/transformation-2-before.webp`, il manque la photo "après"
  correspondante.

## Configurer Stripe

1. Crée trois **produits** dans le [dashboard Stripe](https://dashboard.stripe.com/products),
   un par offre (Start, Essential, Elite), chacun avec un prix associé.
2. Récupère l'ID de chaque prix (`price_...`).
3. Dans les paramètres du projet Vercel → **Environment Variables**, ajoute :

   | Variable | Valeur |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | ta clé secrète Stripe (`sk_live_...` ou `sk_test_...`) |
   | `STRIPE_PRICE_START` | `price_...` de l'offre Start |
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
