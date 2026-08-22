import type { ArticleCategory } from "@/lib/types/database";

/**
 * Source unique des catégories d'articles, dans leur ordre d'affichage.
 *
 * Le site public et le back-office s'y réfèrent tous les deux : ajouter une
 * catégorie se fait ici et dans une migration, nulle part ailleurs. La liste
 * était auparavant recopiée dans six fichiers, qu'il fallait penser à garder
 * synchronisés.
 */
export const ARTICLE_CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: "croyance", label: "Croyance" },
  { value: "jurisprudence", label: "Jurisprudence" },
  { value: "spiritualite", label: "Spiritualité" },
  { value: "histoire", label: "Histoire" },
  { value: "biographie", label: "Biographie" },
  { value: "enseignements", label: "Enseignements" },
  { value: "zikr", label: "Zikr" },
];

/** Libellé affichable d'une catégorie, indexé par sa valeur en base. */
export const articleCategoryLabels = Object.fromEntries(
  ARTICLE_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<ArticleCategory, string>;
