-- ============================================================
-- Durée des médias
--
-- Les cartes de la médiathèque annoncent la durée d'un replay : c'est
-- l'information qui décide si on lance la lecture maintenant ou plus tard.
-- Elle est saisie au back-office, en minutes — la valeur ne peut pas être
-- déduite d'une URL YouTube sans clé d'API.
--
-- Nullable : les médias déjà publiés n'en ont pas, et la carte se contente
-- alors de ne rien afficher.
-- ============================================================

alter table public.medias
  add column if not exists duration_minutes int
  check (duration_minutes is null or duration_minutes > 0);

comment on column public.medias.duration_minutes is
  'Durée du média en minutes, saisie manuellement au back-office.';
