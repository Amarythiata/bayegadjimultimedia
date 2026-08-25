import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/ui/event-card";
import { PageHero } from "@/components/ui/page-hero";
import { BrowseBar } from "@/components/ui/browse-bar";
import { Pagination } from "@/components/ui/pagination";
import type { LiveEventRow } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Calendrier",
  description:
    "Les prochains directs, causeries et rassemblements du dahira Ansaroudine de Linguère.",
};

const filters = [
  { value: "a-venir", label: "À venir" },
  { value: "passes", label: "Passés" },
  { value: "tous", label: "Tous" },
];

const PER_PAGE = 10;

async function getEvents(
  filter: string,
  search: string | undefined,
  page: number,
): Promise<{ items: LiveEventRow[]; total: number }> {
  try {
    const supabase = await createClient();
    // À venir : du plus proche au plus lointain. Passés : du plus récent au
    // plus ancien. Dans les deux cas, le plus pertinent vient en premier.
    const ascending = filter === "a-venir";

    let query = supabase
      .from("live_events")
      .select("*", { count: "exact" })
      .order("scheduled_start", { ascending });

    if (filter === "a-venir") {
      query = query.in("status", ["a_venir", "en_cours"]);
    } else if (filter === "passes") {
      query = query.eq("status", "termine");
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

export default async function CalendrierPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string; q?: string; page?: string }>;
}) {
  const { filtre = "a-venir", q, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { items, total } = await getEvents(filtre, q, page);
  const totalPages = Math.ceil(total / PER_PAGE);

  const emptyMessage =
    filtre === "passes"
      ? "Aucun événement passé à afficher."
      : filtre === "a-venir"
        ? "Aucun événement programmé pour le moment."
        : "Aucun événement ne correspond à cette recherche.";

  return (
    <div>
      <PageHero
        eyebrow="Calendrier"
        title="Calendrier"
        subtitle="Les prochains directs, causeries et rassemblements du dahira — en vidéo comme en radio."
        icon={CalendarDays}
        angle={95}
      />

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <BrowseBar
          basePath="/calendrier"
          placeholder="Rechercher un événement…"
          categories={filters}
          active={filtre}
          query={q}
          paramName="filtre"
          allValue="a-venir"
        />

        {items.length > 0 ? (
          <>
            <div className="mt-6 flex flex-col gap-3">
              {items.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/calendrier"
              params={{ filtre: filtre === "a-venir" ? undefined : filtre, q }}
            />
          </>
        ) : (
          <p className="mt-10 text-center text-sm text-forest-400">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
