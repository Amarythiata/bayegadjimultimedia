import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { deleteNews } from "./actions";

const categoryLabels: Record<string, string> = {
  annonces: "Annonces",
  evenements: "Événements",
  communiques: "Communiqués",
  vie_du_dahira: "Vie du dahira",
};

export default async function ActualitesBackOfficePage() {
  const supabase = await createClient();
  const profile = await getSessionProfile();
  const { data: news } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-forest-900 md:text-xl">Actualités</h1>
        <Link
          href="/back-office/actualites/nouveau"
          className="flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-sm font-medium text-forest-900"
        >
          <Plus size={16} />
          Nouvelle actualité
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {news && news.length > 0 ? (
          news.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest-900">{n.title}</p>
                <p className="text-xs text-forest-400">
                  {categoryLabels[n.category] ?? n.category} ·{" "}
                  <span className={n.status === "publie" ? "text-forest-600" : "text-gold-600"}>
                    {n.status === "publie" ? "Publié" : "Brouillon"}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/back-office/actualites/${n.id}`}
                  className="text-xs text-forest-600 hover:text-forest-900"
                >
                  Modifier
                </Link>
                {profile?.role === "administrateur" && (
                  <form action={deleteNews.bind(null, n.id)}>
                    <button type="submit" className="text-xs text-live-600 hover:text-live-500">
                      Supprimer
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-sm text-forest-400">
            Aucune actualité pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
