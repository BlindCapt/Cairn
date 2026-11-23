# CLAUDE.md — Cairn

PWA de productivité perso, open source, pour tenir une journée **sans pression**.
On s'appuie sur des **repères** plutôt que sur des horaires.
L'utilisateur compose ses journées à partir d'une bibliothèque d'items et de profils de journée.

## Produit

- **Items** : bibliothèque unique, chaque item (tâche à cocher ou bloc à démarrer) existe une seule fois.
- **Profils de journée** : sélection d'items avec réglages propres au profil (minimum ou bonus, ordre, repère). La semaine type associe un profil à chaque jour.
- **Aujourd'hui** : jauge « journée minimum », checklist, bonus, tâches ponctuelles, carrousel de blocs (démarrer / pause / terminer, chrono, note).
- **Note à la validation** : tout item peut demander une note (un ou plusieurs champs libres).
- **Capture** : sas pour noter en 2 s, 3 sorties (aujourd'hui / une date / traité). Une tâche prévue non faite revient dans la Capture, jamais reportée automatiquement.
- **Semaine** (v0.2) : stats, notes, export texte pour une IA (aucun appel API).
- Navigation : Aujourd'hui · Semaine · Capture · Profils · Items.

## Principes

- **Modulaire et générique** : chaque fonctionnalité est un paramètre réutilisable, jamais un cas spécial. Aucune habitude personnelle en dur : tout vient de la base de l'utilisateur.
- **Parité mobile / PC** : mêmes fonctionnalités, mise en page adaptée.
- **Pas de pression** : pas de rouge, pas de culpabilisation, pas de dépendance entre items.
- **Design tokens** : couleurs, typo, espacements, arrondis, ombres uniquement via `src/shared/styles/tokens.css`. Le style n'est pas prioritaire.
- **Langues** : interface en français ; code, fichiers, commits, commentaires en anglais.

## Stack et commandes

React + Vite + TypeScript strict, `vite-plugin-pwa`, `react-router`, Supabase (Postgres + Auth lien magique), CSS Modules, ESLint + Prettier, Vitest + Testing Library. npm, Node `^22.22.2 || >=24.15`.

`npm run dev` · `build` · `preview` · `lint` · `format` · `typecheck` · `test` · `db:types` (utilise l'ID du projet Supabase défini dans `package.json` ; `npx supabase login` la première fois).

## Architecture

- `src/app/` : entrée, routeur, providers, layout + nav.
- `src/features/<today|week|capture|profiles|items|blocks|auth>/` : tout ce qui est propre à une fonctionnalité (pages, composants, requêtes Supabase). API publique via `index.ts`.
- `src/shared/` : `ui/` (composants génériques), `lib/` (`supabase.ts`, `dates.ts`), `hooks/`, `styles/`. Ne dépend jamais de `features/`.
- `src/types/database.ts` : généré par `npm run db:types`, ne pas éditer.
- Alias `@/` = `src/`. Détails : `docs/architecture.md`.

## Modèle de données

Source : `supabase/migrations/0001_init.sql`. Toutes les tables ont `user_id` (défaut `auth.uid()`) et la RLS « own rows ». Les clés étrangères composites `(id, user_id)` empêchent de relier les données de deux utilisateurs.

- `items` : bibliothèque. `type` (`task` | `block`), `duration_min` (blocs seulement), `note_fields text[]` (vide = validation simple, sinon intitulés des champs de note), `archived_at`.
- `day_profiles` : `name`, `color` (hex), `position`.
- `profile_items` : lien profil ↔ item avec réglages propres au profil : `level` (`minimum` | `bonus`), `position`, `cue` (repère). Unique `(profile_id, item_id)`.
- `week_schedule` : un profil par `weekday` (1 = lundi … 7 = dimanche, ISO).
- `profile_overrides` (v0.2) : profil forcé pour un `day`, `source` (`profiles` | `pill`).
- `item_checks` : tâche cochée pour un `day` (unique item + jour), `note jsonb`.
- `block_sessions` : une session par bloc et par jour. `status` (`todo` | `running` | `paused` | `done`), `elapsed_seconds` + `resumed_at` (temps écoulé = `elapsed_seconds + (now() - resumed_at)` si `running`), `note`. Un seul bloc `running` à la fois par utilisateur.
- `captures` : `text`, `status` (`inbox` | `planned` | `done` | `archived`), `planned_date` (obligatoire si et seulement si `planned`), `returned` + `original_date` (tâche revenue car non faite).
- Notes (`note jsonb`) : copie figée `[{ "label": "...", "value": "..." }]`, pour que l'historique reste lisible si les champs de l'item changent.
- `return_overdue_captures(today date) → integer` : repasse en `inbox` les captures `planned` avant `today`. À appeler à l'ouverture de l'app avec la date locale.
- `updated_at` est maintenu par le trigger `set_updated_at()`.

## Règles Supabase

- Toute nouvelle table : `user_id` + RLS « own rows » (`user_id = auth.uid()`).
- Migrations numérotées dans `supabase/migrations/`, jamais modifiées après application.
- Clé `service_role` jamais côté client ni commitée. Le client n'utilise que l'URL et la clé `anon`.
- La date du jour est la date **locale** (`toLocalISODate()`), passée explicitement au serveur.

## Conventions

- TypeScript strict, composants fonctionnels, CSS Modules + tokens uniquement.
- Accessibilité : vrais boutons, labels, zones tactiles ≥ 44 px, contraste ≥ 4,5:1.
- Petits commits Conventional Commits. Avant chaque commit : `npm run lint && npm run typecheck && npm run build`.
- Ne pas ajouter de dépendance sans le signaler.
