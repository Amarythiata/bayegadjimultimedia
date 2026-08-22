import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/ui/article-card";
import type { ArticleCategory, ArticleRow } from "@/lib/types/database";
import { ARTICLE_CATEGORIES } from "@/lib/article-categories";

const categories: { value: ArticleCategory | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  ...ARTICLE_CATEGORIES,
];

async function getArticles(category?: string, search?: string): Promise<ArticleRow[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("articles")
      .select("*")
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category && category !== "toutes") {
      query = query.eq("category", category as ArticleCategory);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie = "toutes", q } = await searchParams;
  const articles = await getArticles(categorie, q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Articles</h1>
      <p className="mt-1 text-sm text-forest-400">
        Textes sur l&apos;islam en général — croyance, jurisprudence, spiritualité, histoire —
        et les textes de zikr récités au dahira.
      </p>

      <form className="mt-4 flex gap-2" action="/articles">
        <input type="hidden" name="categorie" value={categorie} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un article…"
          className="w-full rounded-full border border-border-subtle bg-card-bg px-4 py-2 text-sm"
        />
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <a
            key={c.value}
            href={`/articles?categorie=${c.value}${q ? `&q=${q}` : ""}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${
              categorie === c.value
                ? "border-forest-800 bg-forest-800 text-white"
                : "border-border-subtle text-forest-600"
            }`}
          >
            {c.label}
          </a>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {articles.length > 0 ? (
          articles.map((a) => <ArticleCard key={a.id} article={a} />)
        ) : (
          <p className="text-sm text-forest-400">Aucun article pour le moment.</p>
        )}
      </div>
    </div>
  );
}
