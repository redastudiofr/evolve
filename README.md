# Evolve — site de vente (musculation & remise en forme)

Site Next.js (App Router) avec paiement **Stripe Checkout** intégré directement
sur le site — pas de lien de paiement externe.

## Ce qui est déjà fait

- Page de vente complète en français : accroche, méthode en 5 étapes, programme,
  section fondateur, résultats, FAQ, 3 offres tarifaires (Essentiel / Evolve / Privé).
- Bouton de paiement qui crée une vraie session Stripe Checkout côté serveur
  (`src/app/api/checkout/route.ts`) et redirige vers le paiement sécurisé Stripe.
- Pages `/success` et `/cancel` après paiement.
- Squelettes `/mentions-legales`, `/confidentialite`, `/cgv`.

## Ce qu'il reste à faire avant de vendre pour de vrai

Tout ce qui est écrit entre crochets `[...]` dans le code est un **placeholder** à
remplacer :

- **Histoire du fondateur** et **photo** (`src/app/page.tsx`, section `#fondateur`).
- **Témoignages et photos avant/après** (`#resultats`) — actuellement des exemples
  clairement marqués comme tels, à remplacer uniquement par de vrais retours de
  membres ayant donné leur accord.
- **Politique de garantie / remboursement** (`FAQ_ITEMS` dans `page.tsx`, et `cgv`) —
  ne publie pas de promesse de remboursement sans l'avoir vraiment décidée.
- **Mentions légales, CGV, confidentialité** — ce sont des squelettes juridiques,
  pas des documents valides. Fais-les relire/compléter par un professionnel avant
  d'encaisser un premier paiement (la vente de formation en ligne à des
  particuliers en France a des règles spécifiques, notamment sur le droit de
  rétractation).
- **Email de contact**, liens réseaux sociaux.
- **Prix** : 97 € / 297 € / 890 € sont un premier jet, à ajuster.

## Configurer Stripe

1. Crée trois **produits** dans le [dashboard Stripe](https://dashboard.stripe.com/products),
   un par offre (Essentiel, Evolve, Privé), chacun avec un prix associé.
2. Récupère l'ID de chaque prix (`price_...`).
3. Dans les paramètres du projet Vercel → **Environment Variables**, ajoute :

   | Variable | Valeur |
   | --- | --- |
   | `STRIPE_SECRET_KEY` | ta clé secrète Stripe (`sk_live_...` ou `sk_test_...`) |
   | `STRIPE_PRICE_ESSENTIEL` | `price_...` de l'offre Essentiel |
   | `STRIPE_PRICE_EVOLVE` | `price_...` de l'offre Evolve |
   | `STRIPE_PRICE_PRIVATE` | `price_...` de l'offre Privé |

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
