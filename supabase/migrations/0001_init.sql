-- Cairn — schéma initial (v0.1, couvre aussi les besoins v0.2)
-- À exécuter dans Supabase : SQL Editor > New query > coller > Run.
-- Chaque table porte user_id et est protégée par Row Level Security :
-- un utilisateur ne voit et ne modifie que ses propres lignes.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type item_type      as enum ('task', 'block');
create type item_level     as enum ('minimum', 'bonus');
create type block_status   as enum ('todo', 'running', 'paused', 'done');
create type capture_status as enum ('inbox', 'planned', 'done', 'archived');
create type override_source as enum ('profiles', 'pill');

-- ---------------------------------------------------------------------------
-- Utilitaire : updated_at automatique
-- ---------------------------------------------------------------------------
create function set_updated_at() returns trigger
    language plpgsql as $$
begin
  new.updated_at = now();
return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Bibliothèque d'items
-- note_fields vide = validation simple ; sinon = intitulés des champs de note.
-- ---------------------------------------------------------------------------
create table items (
                       id            uuid primary key default gen_random_uuid(),
                       user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
                       label         text not null check (char_length(label) between 1 and 200),
                       type          item_type not null default 'task',
                       duration_min  integer check (duration_min is null or duration_min > 0),
                       note_fields   text[] not null default '{}',
                       archived_at   timestamptz,
                       created_at    timestamptz not null default now(),
                       updated_at    timestamptz not null default now(),
                       unique (id, user_id),
                       check (type = 'block' or duration_min is null)
);
create trigger items_updated_at before update on items
    for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Profils de journée (nommé day_profiles pour ne pas confondre avec un profil utilisateur)
-- ---------------------------------------------------------------------------
create table day_profiles (
                              id          uuid primary key default gen_random_uuid(),
                              user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
                              name        text not null check (char_length(name) between 1 and 80),
                              color       text not null default '#2F6F5E' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (id, user_id)
);
create trigger day_profiles_updated_at before update on day_profiles
    for each row execute function set_updated_at();

-- Lien profil <-> item, avec les réglages propres au profil.
-- Les clés étrangères composites (id, user_id) empêchent de relier
-- un item d'un utilisateur au profil d'un autre.
create table profile_items (
                               id          uuid primary key default gen_random_uuid(),
                               user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
                               profile_id  uuid not null,
                               item_id     uuid not null,
                               level       item_level not null default 'bonus',
                               position    integer not null default 0,
                               cue         text check (cue is null or char_length(cue) <= 80),
                               created_at  timestamptz not null default now(),
                               unique (profile_id, item_id),
                               foreign key (profile_id, user_id) references day_profiles (id, user_id) on delete cascade,
                               foreign key (item_id, user_id)    references items (id, user_id)        on delete cascade
);
create index profile_items_profile_idx on profile_items (profile_id, position);

-- Semaine type : un profil par jour (1 = lundi … 7 = dimanche, norme ISO).
create table week_schedule (
                               user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
                               weekday     smallint not null check (weekday between 1 and 7),
                               profile_id  uuid not null,
                               primary key (user_id, weekday),
                               foreign key (profile_id, user_id) references day_profiles (id, user_id) on delete cascade
);

-- Exceptions par date (v0.2) : écran Profils ou pastille d'Aujourd'hui.
create table profile_overrides (
                                   user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
                                   day         date not null,
                                   profile_id  uuid not null,
                                   source      override_source not null default 'profiles',
                                   created_at  timestamptz not null default now(),
                                   primary key (user_id, day),
                                   foreign key (profile_id, user_id) references day_profiles (id, user_id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Historique du jour
-- note : copie figée [{ "label": "...", "value": "..." }], pour que l'historique
-- reste lisible même si les champs de l'item changent plus tard.
-- ---------------------------------------------------------------------------

-- Tâches de profil cochées.
create table item_checks (
                             id          uuid primary key default gen_random_uuid(),
                             user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
                             item_id     uuid not null,
                             day         date not null,
                             note        jsonb check (note is null or jsonb_typeof(note) = 'array'),
                             checked_at  timestamptz not null default now(),
                             unique (user_id, item_id, day),
                             foreign key (item_id, user_id) references items (id, user_id) on delete cascade
);
create index item_checks_day_idx on item_checks (user_id, day);

-- Sessions de bloc : une par bloc et par jour (pause / reprise dans la même session).
-- Temps écoulé = elapsed_seconds + (now() - resumed_at) si status = 'running'.
create table block_sessions (
                                id               uuid primary key default gen_random_uuid(),
                                user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
                                item_id          uuid not null,
                                day              date not null,
                                status           block_status not null default 'todo',
                                elapsed_seconds  integer not null default 0 check (elapsed_seconds >= 0),
                                resumed_at       timestamptz,
                                note             jsonb check (note is null or jsonb_typeof(note) = 'array'),
                                started_at       timestamptz,
                                ended_at         timestamptz,
                                updated_at       timestamptz not null default now(),
                                unique (user_id, item_id, day),
                                foreign key (item_id, user_id) references items (id, user_id) on delete cascade,
                                check ((status = 'running') = (resumed_at is not null))
);
create trigger block_sessions_updated_at before update on block_sessions
    for each row execute function set_updated_at();
create index block_sessions_day_idx on block_sessions (user_id, day);
-- Un seul bloc en cours à la fois par utilisateur.
create unique index block_sessions_one_running on block_sessions (user_id) where status = 'running';

-- ---------------------------------------------------------------------------
-- Capture et tâches ponctuelles
-- inbox   = à trier (dans la Capture)
-- planned = prévue pour planned_date (« Juste aujourd'hui » ce jour-là)
-- done    = faite ; archived = traitée hors app
-- returned / original_date : tâche revenue dans la Capture car non faite.
-- ---------------------------------------------------------------------------
create table captures (
                          id             uuid primary key default gen_random_uuid(),
                          user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
                          text           text not null check (char_length(text) between 1 and 500),
                          status         capture_status not null default 'inbox',
                          planned_date   date,
                          returned       boolean not null default false,
                          original_date  date,
                          done_at        timestamptz,
                          created_at     timestamptz not null default now(),
                          updated_at     timestamptz not null default now(),
                          check ((status = 'planned') = (planned_date is not null))
);
create trigger captures_updated_at before update on captures
    for each row execute function set_updated_at();
create index captures_status_idx on captures (user_id, status, planned_date);

-- Renvoie dans la Capture les tâches prévues avant `today` et non faites.
-- `today` est passé par l'app (date locale de l'utilisateur, pas celle du serveur).
-- À appeler à l'ouverture de l'app. Retourne le nombre de tâches revenues.
create function return_overdue_captures(today date) returns integer
    language sql security invoker as $$
  with moved as (
    update captures
       set status        = 'inbox',
           returned      = true,
           original_date = planned_date,
           planned_date  = null
     where user_id = auth.uid()
       and status = 'planned'
       and planned_date < today
    returning 1
  )
select count(*)::integer from moved;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security : chacun ne voit que ses lignes
-- ---------------------------------------------------------------------------
alter table items enable row level security;
create policy "own rows" on items for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table day_profiles enable row level security;
create policy "own rows" on day_profiles for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table profile_items enable row level security;
create policy "own rows" on profile_items for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table week_schedule enable row level security;
create policy "own rows" on week_schedule for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table profile_overrides enable row level security;
create policy "own rows" on profile_overrides for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table item_checks enable row level security;
create policy "own rows" on item_checks for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table block_sessions enable row level security;
create policy "own rows" on block_sessions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table captures enable row level security;
create policy "own rows" on captures for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));