import { createClient } from "@/lib/supabase/server";
import { MediaCard } from "@/components/ui/media-card";
import type { MediaCategory, MediaRow } from "@/lib/types/database";

const categories: { value: MediaCategory | "toutes"; label: string }[] = [
  { value: "toutes", label: "Toutes" },
  { value: "gamou", label: "Gamou" },
  { value: "causerie", label: "Causerie" },
  { value: "cours", label: "Cours" },
  { value: "conference", label: "Conférence" },
  { value: "autre", label: "Autre" },
];

async function getMedias(category?: string, search?: string): Promise<MediaRow[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("medias")
      .select("*")
      .eq("status", "publie")
      .order("published_at", { ascending: false });

    if (category && category !== "toutes") {
      query = query.eq("category", category as MediaCategory);
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

export default async function MediasPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { categorie = "toutes", q } = await searchParams;
  const medias = await getMedias(categorie, q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Médiathèque</h1>
      <p className="mt-1 text-sm text-forest-400">
        Replays vidéo et audio des directs passés — Gamou, causeries, cours, conférences.
      </p>

      <form className="mt-4 flex gap-2" action="/medias">
        <input type="hidden" name="categorie" value={categorie} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher dans la médiathèque…"
          className="w-full rounded-full border border-border-subtle bg-card-bg px-4 py-2 text-sm"
        />
      </form>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <a
            key={c.value}
            href={`/medias?categorie=${c.value}${q ? `&q=${q}` : ""}`}
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
        {medias.length > 0 ? (
          medias.map((m) => <MediaCard key={m.id} media={m} />)
        ) : (
          <p className="text-sm text-forest-400">Aucun média pour le moment.</p>
        )}
      </div>
    </div>
  );
}
