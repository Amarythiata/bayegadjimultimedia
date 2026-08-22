import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatEventDateTime } from "@/lib/dates";
import { setLiveStatus } from "./actions";
import { LiveStatusButton } from "./live-status-button";

const statusLabels: Record<string, string> = {
  a_venir: "À venir",
  en_cours: "En cours",
  termine: "Terminé",
};

const statusStyles: Record<string, string> = {
  a_venir: "text-gold-600",
  en_cours: "text-live-600",
  termine: "text-forest-400",
};

export default async function DirectBackOfficePage() {
  const supabase = await createClient();
  const { data: liveEvents } = await supabase
    .from("live_events")
    .select("*")
    .order("scheduled_start", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-forest-900 md:text-xl">Direct</h1>
        <Link
          href="/back-office/direct/nouveau"
          className="flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-sm font-medium text-forest-900"
        >
          <Plus size={16} />
          Planifier un direct
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {liveEvents && liveEvents.length > 0 ? (
          liveEvents.map((live) => (
            <div key={live.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest-900">{live.title}</p>
                <p className="text-xs text-forest-400">
                  {/* Heure de Dakar, comme sur le site public : c'est d'après
                      elle qu'on décide du moment de passer en direct. */}
                  {formatEventDateTime(live.scheduled_start)} ·{" "}
                  {live.live_type === "video" ? "Vidéo" : "Radio"} ·{" "}
                  <span className={statusStyles[live.status]}>{statusLabels[live.status]}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <LiveStatusButton
                  status={live.status}
                  goLive={setLiveStatus.bind(null, live.id, "en_cours")}
                  endLive={setLiveStatus.bind(null, live.id, "termine")}
                />
                <Link
                  href={`/back-office/direct/${live.id}`}
                  className="text-xs text-forest-600 hover:text-forest-900"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-sm text-forest-400">
            Aucun direct planifié pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
