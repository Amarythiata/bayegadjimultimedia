-- ============================================================
-- Bayegadji Multimédia — Lot 2
-- Articles : textes éditoriaux sur l'islam en général (distincts
-- des actualités, qui couvrent l'actualité quotidienne du dahira/tariqa)
-- ============================================================

create type public.article_category as enum (
  'croyance',
  'jurisprudence',
  'spiritualite',
  'histoire',
  'biographie',
  'enseignements'
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,          -- chapô
  body text not null,
  cover_image_url text,
  category public.article_category not null,
  status public.publication_status not null default 'brouillon',
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_published_idx on public.articles (published_at desc) where status = 'publie';
create index articles_category_idx on public.articles (category);

alter table public.articles enable row level security;

create policy "Les articles publiés sont visibles par tous"
  on public.articles for select
  using (status = 'publie' or public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent créer des articles"
  on public.articles for insert
  with check (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent modifier des articles"
  on public.articles for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les administrateurs peuvent supprimer des articles"
  on public.articles for delete
  using (public.current_user_role() = 'administrateur');
