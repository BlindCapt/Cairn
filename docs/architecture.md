# Architecture

Technical decisions and conventions. Short version: `CLAUDE.md`.

## Why a PWA

- One codebase for Android (installed from Chrome) and desktop: mobile / PC feature parity comes for free.
- No app store or native toolchain, automatic updates.
- Manifest shortcuts give native-like entry points (e.g. **Quick capture** → `/capture?quick=1`).
- Offline: app shell only for now (precached by Workbox). Offline data sync is out of scope.

## Why Supabase

- Managed Postgres with **Row Level Security**: the browser queries the database directly with the
  public anon key, and RLS ensures each user only sees their own rows. No backend to run.
- **Magic link** auth: no passwords to manage.
- SQL migrations versioned in `supabase/migrations/`, TypeScript types generated from the schema.
- Logic that must run atomically lives in Postgres functions (e.g. `return_overdue_captures`).

Rules: every table has `user_id` + "own rows" RLS policies; migrations are numbered and never edited
once applied; the `service_role` key never appears in client code or in the repo.

## Feature-based organisation

```
src/app        entry point, router, providers, layout
src/features   one folder per feature: today, week, capture, profiles, items, blocks, auth
src/shared     generic code (ui, lib, hooks, styles), never imports from features
src/types      generated database types
```

- A feature owns its pages, components, hooks, queries and styles, and exposes a public API in `index.ts`.
- Code moves to `shared/` only when it is generic and used by at least two features.
- `blocks` has no route: it powers the block carousel in Today. `auth` owns `/login`.

## No hard-coded habits

Every behaviour is a parameter stored in the user's data (asks for a note, note fields, counts toward
the minimum day, cue…). If code seems to need `if (item.name === ...)`, it needs a setting instead.

## Dates and "today"

- "Today" is always the user's **local** calendar date, computed on the client with `toLocalISODate()`
  (`src/shared/lib/dates.ts`) as `YYYY-MM-DD`.
- It is **passed explicitly** to the server, e.g. `supabase.rpc('return_overdue_captures', { today })`.
  The database never decides what today is (`now()`, `current_date`): it runs in UTC.
- Never use `toISOString()` to get a date: it converts to UTC and can shift the day.
- Day-level data uses `date` columns; `timestamptz` is only for events (block start / end).
- Overdue tasks are never moved forward automatically: they go back to the Capture.

## Styling

- CSS Modules per component; global CSS only in `src/shared/styles/`.
- All design values are CSS variables in `tokens.css`, so a redesign touches one file.
- The manifest cannot read CSS variables: `vite.config.ts` duplicates `--color-accent` and `--color-bg`. Keep them in sync.
- No red, no alarming states. Mobile first: bottom nav, top nav from 768 px.
