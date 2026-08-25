import Link from "next/link";
import type { Metadata } from "next";
import { Headphones, LayoutGrid } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { MediaCard } from "@/components/ui/media-card";
import { PageHero } from "@/components/ui/page-hero";
import { BrowseBar } from "@/components/ui/browse-bar";
import { Pagination } from "@/components/ui/pagination";
import type { MediaCategory, MediaRow } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Médiathèque",
  description:
    "Tous les replays vidéo et audio du dahira Ansaroudine de Linguère : Gamou, causeries, cours et conférences.",
};

const categories = [
  { value: "toutes", label: "Toutes" },
  { value: "gamou", label: "Gamou" },
  { value: "causerie", label: "Causerie" },
  { value: "cours", label: "Cours" },
  { value: "conference", label: "Conférence" },
  { value: "autre", label: "Autre" },
];

// Six par page plutôt que neuf : en une colonne sur mobile, neuf vignettes
// 16:9 font près de 2 700 px à faire défiler avant d'atteindre le bas.
const PER_PAGE = 6;

async function getMedias(
  category: string,
  search: string | undefined,
  page: number,
): Promise<{ items: MediaRow[]; total: number }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("medias")
      .select("*", { count: "exact" })
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category !== "toutes") {
      query = query.eq("category", category as MediaCategory);
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

export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string; page?: string }>;
}) {
  const { categorie = "toutes", q, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { items, total } = await getMedias(categorie, q, page);
  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <PageHero
        eyebrow="Médiathèque"
        title="Médiathèque"
        subtitle="Accédez à tous nos replays vidéo et audio : Gamou, causeries, cours, conférences et plus encore."
        icon={Headphones}
        angle={105}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <BrowseBar
          basePath="/medias"
          placeholder="Rechercher dans la médiathèque…"
          categories={categories}
          active={categorie}
          query={q}
        />

        {items.length > 0 ? (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <MediaCard key={m.id} media={m} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/medias"
              params={{ categorie: categorie === "toutes" ? undefined : categorie, q }}
            />
          </>
        ) : (
          <p className="mt-10 text-center text-sm text-forest-400">
            Aucun média ne correspond à cette recherche.
          </p>
        )}

        {/* Sortie de secours : un visiteur qui ne trouve rien doit pouvoir
            repartir de la liste complète plutôt que d'affiner à l'aveugle. */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-border-subtle bg-card-bg p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
              <LayoutGrid size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-forest-900">
                Vous ne trouvez pas ce que vous cherchez ?
              </p>
              <p className="mt-0.5 text-xs text-forest-400">
                Parcourez l&apos;ensemble des enregistrements, toutes catégories confondues.
              </p>
            </div>
          </div>
          <Link
            href="/medias"
            className="shrink-0 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 transition-opacity hover:opacity-90"
          >
            Voir toute la médiathèque
          </Link>
        </div>
      </div>
    </div>
  );
}
