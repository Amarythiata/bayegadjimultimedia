-- ============================================================
-- Bayegadji Multimédia — Lot 3
-- Messages de contact envoyés depuis le formulaire public
-- ============================================================

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null check (char_length(message) between 1 and 2000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "Tout le monde peut envoyer un message de contact"
  on public.contact_messages for insert
  with check (true);

create policy "Seuls les admins et modérateurs peuvent lire les messages"
  on public.contact_messages for select
  using (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les admins et modérateurs peuvent marquer un message comme lu"
  on public.contact_messages for update
  using (public.current_user_role() in ('moderateur', 'administrateur'));

create policy "Seuls les administrateurs peuvent supprimer un message"
  on public.contact_messages for delete
  using (public.current_user_role() = 'administrateur');
