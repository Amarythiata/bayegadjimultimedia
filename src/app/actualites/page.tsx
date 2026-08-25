import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NewsCard } from "@/components/ui/news-card";
import { PageHero } from "@/components/ui/page-hero";
import { BrowseBar } from "@/components/ui/browse-bar";
import { Pagination } from "@/components/ui/pagination";
import type { NewsCategory, NewsRow } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Les derniers événements, annonces et informations du dahira Ansaroudine de Linguère.",
};

const categories = [
  { value: "toutes", label: "Toutes" },
  { value: "annonces", label: "Annonces" },
  { value: "evenements", label: "Événements" },
  { value: "communiques", label: "Communiqués" },
  { value: "vie_du_dahira", label: "Vie du dahira" },
];

const PER_PAGE = 8;

async function getNews(
  category: string,
  search: string | undefined,
  page: number,
): Promise<{ items: NewsRow[]; total: number }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("news")
      // `count: exact` en une seule requête : une seconde requête pour compter
      // doublerait les allers-retours à chaque changement de page.
      .select("*", { count: "exact" })
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category !== "toutes") {
      query = query.eq("category", category as NewsCategory);
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

export default async function ActualitesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string; page?: string }>;
}) {
  const { categorie = "toutes", q, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { items, total } = await getNews(categorie, q, page);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <PageHero
        eyebrow="Actualités"
        title="Actualités"
        subtitle="Restez informé des derniers événements, annonces et informations de la communauté."
        icon={Newspaper}
        angle={125}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <BrowseBar
          basePath="/actualites"
          placeholder="Rechercher une actualité…"
          categories={categories}
          active={categorie}
          query={q}
        />

        {items.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/actualites"
              params={{ categorie: categorie === "toutes" ? undefined : categorie, q }}
            />
          </>
        ) : (
          <p className="mt-10 text-center text-sm text-forest-400">
            Aucune actualité ne correspond à cette recherche.
          </p>
        )}
      </div>
    </div>
  );
}
