# Cairn

Cairn helps you get through your day **without pressure**, relying on cues ("after lunch", "when I get
home") rather than fixed times. Like a cairn on a trail, it marks the way without telling you how fast
to walk.

## Philosophy

- **No pressure**: no red, no guilt, no streaks, no chains of dependent tasks.
- **Generic**: every feature is a reusable setting. Nothing about anyone's habits is hard-coded.
- **Same app everywhere**: identical features on mobile and desktop.

## Features (planned)

- **Item library**: each item (a task to check off or a block to start) exists once.
- **Day profiles**: a selection of items with per-profile settings (minimum or bonus, order, cue).
  A typical week assigns a profile to each day.
- **Today**: "minimum day" gauge, checklist, bonus items, one-off tasks, carousel of blocks
  (start / pause / finish, timer, note when finishing).
- **Notes on completion**: any item can ask for a note (one or more free fields).
- **Capture**: an inbox to jot something down in 2 seconds. Each line leaves through one of three
  exits: today, a date, or done. A planned task left undone goes back to the Capture; it is never
  postponed automatically.
- **Week**: stats, notes, and a text summary to paste into an AI assistant (no API call).

## Roadmap

- **v0.1**: usable every day (items, profiles, Today, Capture).
- **v0.2**: week view and AI export.
- **v0.3**: desktop layouts and public release.

## Stack

React + Vite + TypeScript (strict), installable PWA (`vite-plugin-pwa`), React Router, Supabase
(Postgres with Row Level Security, magic link auth), CSS Modules with design tokens, ESLint, Prettier,
Vitest + Testing Library.

## Getting started

Requirements: Node `^22.22.2` or `>=24.15`, npm, a free [Supabase](https://supabase.com) account.

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/BlindCapt/Cairn.git
   cd Cairn
   npm install
   ```
2. Create a new Supabase project.
3. In the Supabase **SQL Editor**, run the content of `supabase/migrations/0001_init.sql`.
4. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   (Project Settings > API). Never use the `service_role` key.
5. Start the app:
   ```bash
   npm run dev
   ```

## Scripts

| Script              | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`       | Start the dev server                                                           |
| `npm run build`     | Type-check and build for production                                            |
| `npm run preview`   | Serve the production build                                                     |
| `npm run lint`      | Run ESLint                                                                     |
| `npm run format`    | Format files with Prettier                                                     |
| `npm run typecheck` | Run the TypeScript compiler without emitting                                   |
| `npm test`          | Run the tests once                                                             |
| `npm run db:types`  | Generate `src/types/database.ts` (set your project ID in `package.json` first) |

## License

[MIT](LICENSE) © BlindCapt
