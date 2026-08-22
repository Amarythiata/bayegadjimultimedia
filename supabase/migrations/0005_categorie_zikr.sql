-- ============================================================
-- Ajoute la catégorie « Zikr » aux articles
--
-- Elle accueille les qasidas et textes de zikr récités au dahira,
-- distincts des textes explicatifs des autres catégories.
--
-- `add value` ne peut pas être suivi d'une insertion utilisant la
-- nouvelle valeur dans la même transaction : les articles de zikr
-- sont donc insérés séparément, une fois cette migration appliquée.
-- ============================================================

alter type public.article_category add value if not exists 'zikr';
