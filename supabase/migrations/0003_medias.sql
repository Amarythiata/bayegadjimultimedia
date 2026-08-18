-- ============================================================
-- Bayegadji Multimédia — Lot 2
-- Médiathèque : replays vidéo/audio des directs passés, ajoutés
-- manuellement au fil de l'eau via le back-office (pas d'import
-- en masse prévu).
-- ============================================================

create type public.media_category as enum (
  'gamou',
  'causerie',
  'cours',
  'conference',
  'autre'
);

create table public.medias (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  media_type public.live_type not null default 'video',
  media_url text not null,        -- embed YouTube/Facebook si vidéo, fichier audio si radio
  cover_image_url text,
  category public.media_category not null,
  status public.publication_status not null default 'brouillon',
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index medias_published_idx on public.medias (published_at desc) where status = 'publie';
create index medias_category_idx on public.medias (category);

alter table public.medias enable row level security;

create policy "Les médias publiés sont visibles par tous"
  on public.medias for select
  using (status = 'publie' or public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent créer des médias"
  on public.medias for insert
  with check (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent modifier des médias"
  on public.medias for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les administrateurs peuvent supprimer des médias"
  on public.medias for delete
  using (public.current_user_role() = 'administrateur');
