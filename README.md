# Muscu — suivi de musculation (PWA)

Application Next.js (App Router) installable sur iPhone et Android, avec cache
hors-ligne complet et notifications push réelles (VAPID) qui s'affichent même
quand l'app est fermée. Tout tient dans un seul projet déployé sur Vercel :
front, routes API et planification des rappels.

## Ce que fait l'app

- **Aujourd'hui** — XP total, niveau (Fondation, Régularité, Discipline,
  Performance, Elite) avec barre de progression, jours d'affilée, taux de
  réussite du jour et sur 7 jours, checklist quotidienne de 10 tâches valant
  130 XP au total.
- **Séances** — les 5 séances en rotation avec séries, fourchette de reps,
  repos, RPE et charge actuelle. Saisie série par série, suggestion automatique
  de la charge suivante quand le haut de la fourchette est atteint sur toutes
  les séries, historique des séances.
- **Progression** — poids et mensurations (bras, poitrine, taille, cuisse) avec
  courbe dans le temps.
- **Records** — meilleure performance par exercice (1RM estimé, formule
  d'Epley), date, et écart avec le record précédent.
- **Réglages** — profil, fuseau horaire, heures de tous les rappels, activation
  des notifications push sur l'appareil, notification de test.

## Démarrage local

```bash
npm install
npm run dev
```

L'app est protégée par un mot de passe unique. Sans variable d'environnement,
le mot de passe par défaut est `Qn2JhVfS` — à changer avant tout usage réel
(voir `APP_PASSWORD` plus bas).

## Variables d'environnement

Copier `.env.example` vers `.env.local` en local, et renseigner les mêmes clés
sur Vercel (Project → Settings → Environment Variables).

| Variable | Rôle |
| --- | --- |
| `APP_PASSWORD` | Mot de passe d'accès à l'app |
| `AUTH_SECRET` | Secret HMAC signant le cookie de session |
| `CRON_SECRET` | Secret exigé par `/api/cron/notify` |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Paire de clés Web Push |
| `VAPID_SUBJECT` | `mailto:` de contact exigé par le protocole VAPID |
| `POSTGRES_URL` | Chaîne de connexion Postgres (ajoutée automatiquement par l'intégration) |

Toutes ont une valeur de repli codée dans le projet pour qu'un premier
déploiement fonctionne immédiatement. **Remplace au minimum `APP_PASSWORD`,
`AUTH_SECRET` et les clés VAPID** : les valeurs par défaut sont dans le dépôt.

Valeurs générées pour ce projet, à coller dans **Environment Variables** sur
Vercel (une ligne = une variable) :

```
APP_PASSWORD=Qn2JhVfS
AUTH_SECRET=aTNau--fShcJ1whzRdM_IUJpZPQvTvUojY6nxhkATlk
CRON_SECRET=vejhEjq1NCHLlcS1NOVTATLH
VAPID_PUBLIC_KEY=BCXIXGZJ9R2h0-ici0R5MkNYi729igaLVqKWaZoWXiK6I4TR8gUpw3J8MdFfxD05-XHx22MbUJZdWyUNesMWvik
VAPID_PRIVATE_KEY=exgvMVSdv8nSnnsDI5HL-3QOdUL5K9j-Ei-NFXArd8A
VAPID_SUBJECT=mailto:obsyde.fr@gmail.com
```

Change `APP_PASSWORD` pour un mot de passe que tu retiens : c'est le seul rempart
devant tes données, et celui-ci est écrit dans le dépôt.

### Générer des clés VAPID

```bash
npm run vapid
```

La commande affiche `VAPID_PUBLIC_KEY=…` et `VAPID_PRIVATE_KEY=…` à recopier
dans les variables d'environnement Vercel. Après changement de clés, il faut
réactiver les notifications sur chaque appareil (les anciens abonnements ne sont
plus valides).

## Connecter le stockage

Sans base de données, l'app tourne sur un stockage serveur temporaire : elle
fonctionne, mais les données ne survivent pas au recyclage de l'instance. Un
bandeau le signale sur l'écran Aujourd'hui.

Pour rendre le stockage durable :

1. Tableau de bord Vercel → le projet → onglet **Storage** → **Create Database**.
2. Choisir **Postgres** (Neon dans le Marketplace Vercel — free tier suffisant).
3. **Connect** vers le projet. Vercel injecte `POSTGRES_URL` / `DATABASE_URL`
   dans les variables d'environnement.
4. Redéployer. Les tables (`app_state`, `push_subs`, `notif_log`) sont créées
   automatiquement au premier appel.

Le client garde en plus une copie locale dans `localStorage` : l'app reste
utilisable hors-ligne et se resynchronise dès le retour du réseau.

## Déploiement

### Via GitHub et le tableau de bord Vercel

Le dossier est déjà un dépôt Git avec un premier commit. Il reste à le pousser
et à l'importer :

1. Créer un dépôt **vide** sur [github.com/new](https://github.com/new) —
   par exemple `muscu-app`, sans README ni .gitignore (ils existent déjà).
2. Depuis le dossier du projet :

   ```bash
   git remote add origin https://github.com/TON-PSEUDO/muscu-app.git
   git push -u origin main
   ```

   Git ouvre une fenêtre d'authentification GitHub au premier push.
3. Sur [vercel.com/new](https://vercel.com/new), **Import Git Repository**,
   choisir le dépôt. Vercel détecte Next.js tout seul : ne rien changer aux
   réglages de build.
4. Avant de cliquer **Deploy**, ouvrir **Environment Variables** et coller les
   valeurs du tableau ci-dessous.
5. **Deploy**. L'URL `https://muscu-app-xxxx.vercel.app` apparaît en une minute.

### Via la ligne de commande

```bash
npm i -g vercel
vercel deploy --prod
```

## Planification des rappels

`/api/cron/notify` lit les heures configurées dans les réglages, calcule les
rappels dus dans le fuseau horaire choisi, et envoie les push correspondants.
Chaque rappel porte une clé de déduplication (`creatine:2026-08-22`, …) : il ne
part qu'une seule fois par créneau, même si la route est appelée plusieurs fois.

Il faut donc appeler cette route toutes les 10 à 15 minutes.

**Le plan Hobby de Vercel limite les cron jobs à un déclenchement par jour** —
largement insuffisant pour des rappels à l'heure près. `vercel.json` déclare
donc un cron quotidien (compatible Hobby, il sert de filet de sécurité), et la
cadence réelle vient d'un planificateur externe gratuit :

1. Créer un compte sur [cron-job.org](https://cron-job.org) (gratuit).
2. Nouveau cron job, URL :

   ```
   https://TON-APP.vercel.app/api/cron/notify?secret=vejhEjq1NCHLlcS1NOVTATLH
   ```

3. Intervalle : toutes les 15 minutes. Enregistrer.

GitHub Actions ou Uptime Robot font la même chose si tu préfères.

En passant au plan Pro, remplace le `schedule` de `vercel.json` par
`*/15 * * * *` et le planificateur externe devient inutile.

La route accepte le secret en `Authorization: Bearer …`, en paramètre `?secret=`,
ou l'en-tête `x-vercel-cron` que Vercel ajoute lui-même. Une fenêtre de rattrapage
de 75 minutes absorbe l'imprécision du planificateur : un rappel prévu à 9 h 00
part encore s'il est déclenché à 9 h 40, mais jamais deux fois.

La route accepte le secret en `Authorization: Bearer …`, en paramètre `?secret=`,
ou l'en-tête `x-vercel-cron` que Vercel ajoute lui-même. Une fenêtre de rattrapage
de 75 minutes absorbe l'imprécision du planificateur : un rappel prévu à 9 h 00
part encore s'il est déclenché à 9 h 40, mais jamais deux fois.

Rappels gérés : créatine (heure fixe), hydratation (toutes les N heures entre
deux bornes), 3 repas, sommeil, séance (aux jours d'entraînement choisis).
Toutes les heures se règlent dans l'écran Réglages.

## Installer sur l'écran d'accueil

### iPhone (iOS 16.4 minimum pour les notifications)

1. Ouvrir l'URL Vercel **dans Safari** (pas Chrome ni un navigateur intégré).
2. Se connecter avec le mot de passe.
3. Bouton **Partager** → **Sur l'écran d'accueil** → **Ajouter**.
4. Fermer Safari et **rouvrir l'app depuis l'icône** de l'écran d'accueil.
5. Aller dans **Réglages** → activer l'interrupteur **Cet appareil** → accepter
   la demande de permission → **Envoyer une notification de test**.

iOS n'autorise les notifications push que depuis une app installée sur l'écran
d'accueil : l'étape 4 est obligatoire, sinon le bouton d'activation échoue.

### Android

Chrome propose « Installer l'application » dans le menu, ou via la bannière
d'installation. Les notifications fonctionnent aussi hors installation, mais
l'installation donne l'icône et le mode plein écran.

## Structure

```
src/
  app/
    page.tsx               Aujourd'hui (checklist, XP, niveau)
    seances/               Les 5 séances, saisie et historique
    progression/           Poids et mensurations + courbe
    records/               Records par exercice
    reglages/              Profil, rappels, activation push
    login/                 Écran de connexion
    api/
      auth/login|logout    Cookie de session signé
      data                 Lecture / écriture de l'état complet
      push/key             Clé publique VAPID
      push/subscribe       Enregistrement et suppression d'abonnement
      push/test            Notification de test
      cron/notify          Envoi des rappels dus
  lib/
    program.ts             Les 5 séances et leurs exercices
    logic.ts               XP, niveaux, séries, records, suggestions de charge
    schedule.ts            Calcul des rappels dus
    push.ts                Envoi web-push (VAPID)
    db.ts                  Postgres, avec repli en mémoire
    auth.ts                Cookie HMAC (Web Crypto, compatible middleware)
  middleware.ts            Protection de toutes les routes
public/
  manifest.webmanifest     Manifeste PWA
  sw.js                    Service worker : cache hors-ligne + push
  icons/                   Icônes 192, 512, maskable, apple-touch
```

## Notes

- Le service worker met en cache les pages visitées (network-first) et les
  assets statiques (cache-first). Les appels `/api/*` passent toujours par le
  réseau : c'est le `localStorage` du client qui assure le mode hors-ligne.
- Les données sont stockées comme un seul document JSON (`app_state`), ce qui
  suffit largement pour un utilisateur unique et simplifie la synchronisation.
- Les records sont recalculés à partir de l'historique des séances, il n'y a
  donc rien à corriger à la main si une séance est modifiée.
