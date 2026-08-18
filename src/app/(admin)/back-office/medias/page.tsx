import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { deleteMedia } from "./actions";

const categoryLabels: Record<string, string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

export default async function MediasBackOfficePage() {
  const supabase = await createClient();
  const profile = await getSessionProfile();
  const { data: medias } = await supabase
    .from("medias")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-forest-900 md:text-xl">Médiathèque</h1>
        <Link
          href="/back-office/medias/nouveau"
          className="flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-sm font-medium text-forest-900"
        >
          <Plus size={16} />
          Ajouter un média
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {medias && medias.length > 0 ? (
          medias.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest-900">{m.title}</p>
                <p className="text-xs text-forest-400">
                  {categoryLabels[m.category] ?? m.category} ·{" "}
                  {m.media_type === "video" ? "Vidéo" : "Audio"} ·{" "}
                  <span className={m.status === "publie" ? "text-forest-600" : "text-gold-600"}>
                    {m.status === "publie" ? "Publié" : "Brouillon"}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/back-office/medias/${m.id}`}
                  className="text-xs text-forest-600 hover:text-forest-900"
                >
                  Modifier
                </Link>
                {profile?.role === "administrateur" && (
                  <form action={deleteMedia.bind(null, m.id)}>
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
            Aucun média pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
