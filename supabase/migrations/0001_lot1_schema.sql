-- ============================================================
-- Bayegadji Multimédia — Lot 1
-- Schéma : profils/rôles, actualités, directs, chat live
-- ============================================================

create type public.user_role as enum ('visiteur', 'moderateur', 'administrateur');
create type public.live_status as enum ('a_venir', 'en_cours', 'termine');
create type public.live_type as enum ('video', 'radio');
create type public.news_category as enum ('annonces', 'evenements', 'communiques', 'vie_du_dahira');
create type public.publication_status as enum ('brouillon', 'publie');

-- ---------- Profils & rôles ----------
-- Un profil est créé automatiquement à l'inscription (trigger plus bas).
-- Le rôle par défaut est 'visiteur' ; seul un administrateur peut promouvoir
-- un compte en 'moderateur' ou 'administrateur' (via le back-office, pas via l'API publique).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'visiteur',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Fonction utilitaire : rôle de l'utilisateur courant (évite la récursion RLS)
create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "Un profil est visible par son propriétaire et les admins"
  on public.profiles for select
  using (auth.uid() = id or public.current_user_role() = 'administrateur');

create policy "Un utilisateur peut modifier son propre profil (hors rôle)"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger : création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Actualités ----------
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,          -- chapô
  body text not null,
  cover_image_url text,
  category public.news_category not null,
  status public.publication_status not null default 'brouillon',
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_published_idx on public.news (published_at desc) where status = 'publie';
create index news_category_idx on public.news (category);

alter table public.news enable row level security;

create policy "Les actualités publiées sont visibles par tous"
  on public.news for select
  using (status = 'publie' or public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent créer/modifier des actualités"
  on public.news for insert
  with check (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent modifier des actualités"
  on public.news for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les administrateurs peuvent supprimer des actualités"
  on public.news for delete
  using (public.current_user_role() = 'administrateur');

-- ---------- Directs (live) ----------
create table public.live_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_url text,
  status public.live_status not null default 'a_venir',
  scheduled_start timestamptz not null,
  ended_at timestamptz,
  live_type public.live_type not null default 'video',
  video_embed_url text,        -- URL embed YouTube Live / Facebook Live
  radio_stream_url text,       -- URL du flux Icecast (AzuraCast)
  viewer_count int not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index live_events_status_idx on public.live_events (status, scheduled_start);

alter table public.live_events enable row level security;

create policy "Les directs sont visibles par tous"
  on public.live_events for select
  using (true);

create policy "Seuls les admins et modérateurs peuvent planifier un direct"
  on public.live_events for insert
  with check (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent modifier un direct"
  on public.live_events for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

-- ---------- Chat live ----------
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  live_event_id uuid not null references public.live_events(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  author_display_name text not null,
  content text not null check (char_length(content) between 1 and 500),
  is_hidden boolean not null default false,   -- masqué par un modérateur
  created_at timestamptz not null default now()
);

create index chat_messages_live_event_idx on public.chat_messages (live_event_id, created_at);

alter table public.chat_messages enable row level security;

create policy "Les messages non masqués sont visibles par tous"
  on public.chat_messages for select
  using (is_hidden = false or public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Tout utilisateur authentifié peut poster un message"
  on public.chat_messages for insert
  with check (auth.uid() = author_id);

create policy "Seuls les modérateurs et admins peuvent masquer un message"
  on public.chat_messages for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

-- Realtime : nécessaire pour que Supabase Realtime diffuse les inserts/updates
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.live_events;

-- ---------- Vue pour le dashboard back-office (Epic 5) ----------
create or replace view public.dashboard_stats as
select
  (select count(*) from public.news where status = 'publie') as actualites_publiees,
  (select count(*) from public.news where status = 'brouillon') as actualites_brouillon,
  (select exists (select 1 from public.live_events where status = 'en_cours')) as direct_en_cours;
