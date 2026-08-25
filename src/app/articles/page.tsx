import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ui/article-card";
import { PageHero } from "@/components/ui/page-hero";
import { BrowseBar } from "@/components/ui/browse-bar";
import { Pagination } from "@/components/ui/pagination";
import type { ArticleCategory, ArticleRow } from "@/lib/types/database";
import { ARTICLE_CATEGORIES } from "@/lib/article-categories";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Textes sur l'islam en général — croyance, jurisprudence, spiritualité, histoire — et les textes de zikr récités au dahira Ansaroudine de Linguère.",
};

const categories = [{ value: "toutes", label: "Toutes" }, ...ARTICLE_CATEGORIES];

const PER_PAGE = 8;

async function getArticles(
  category: string,
  search: string | undefined,
  page: number,
): Promise<{ items: ArticleRow[]; total: number }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("articles")
      // `count: exact` en une seule requête : une seconde requête pour compter
      // doublerait les allers-retours à chaque changement de page.
      .select("*", { count: "exact" })
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category !== "toutes") {
      query = query.eq("category", category as ArticleCategory);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const from = (page - 1) * PER_PAGE;
    const { data, count } = await query.range(from, from + PER_PAGE - 1);
    return { items: data ?? [], total: count ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string; page?: string }>;
}) {
  const { categorie = "toutes", q, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { items, total } = await getArticles(categorie, q, page);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <PageHero
        eyebrow="Articles"
        title="Articles"
        subtitle="Textes sur l'islam en général — croyance, jurisprudence, spiritualité, histoire — et les textes de zikr récités au dahira."
        icon={BookOpen}
        angle={135}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <BrowseBar
          basePath="/articles"
          placeholder="Rechercher un article…"
          categories={categories}
          active={categorie}
          query={q}
        />

        {items.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/articles"
              params={{ categorie: categorie === "toutes" ? undefined : categorie, q }}
            />
          </>
        ) : (
          <p className="mt-10 text-center text-sm text-forest-400">
            Aucun article ne correspond à cette recherche.
          </p>
        )}
      </div>
    </div>
  );
}
