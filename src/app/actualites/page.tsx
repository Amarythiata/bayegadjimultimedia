import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/ui/news-card";
import type { NewsCategory, NewsRow } from "@/lib/types/database";

const categories: { value: NewsCategory | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "annonces", label: "Annonces" },
  { value: "evenements", label: "Événements" },
  { value: "communiques", label: "Communiqués" },
  { value: "vie_du_dahira", label: "Vie du dahira" },
];

async function getNews(category?: string, search?: string): Promise<NewsRow[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("news")
      .select("*")
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category && category !== "toutes") {
      query = query.eq("category", category as NewsCategory);
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

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie = "toutes", q } = await searchParams;
  const news = await getNews(categorie, q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Actualités</h1>

      <form className="mt-4 flex gap-2" action="/actualites">
        <input type="hidden" name="categorie" value={categorie} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher une actualité…"
          className="w-full rounded-full border border-border-subtle bg-card-bg px-4 py-2 text-sm"
        />
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <a
            key={c.value}
            href={`/actualites?categorie=${c.value}${q ? `&q=${q}` : ""}`}
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
        {news.length > 0 ? (
          news.map((n) => <NewsCard key={n.id} news={n} />)
        ) : (
          <p className="text-sm text-forest-400">
            Aucune actualité pour le moment — connectez Supabase pour voir les données réelles.
          </p>
        )}
      </div>
    </div>
  );
}
