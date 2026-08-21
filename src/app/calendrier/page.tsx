import { Video, Radio } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LiveBadge } from "@/components/ui/live-badge";
import { formatEventDateTime } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";

async function getEvents() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("live_events")
      .select("*")
      .order("scheduled_start", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

function EventCard({ event }: { event: LiveEventRow }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-card-bg p-4">
      <div className="flex items-center gap-2">
        {event.status === "en_cours" && <LiveBadge viewerCount={event.viewer_count} />}
        {event.status === "a_venir" && (
          <span className="rounded-full bg-gold-100 px-2.5 py-1 text-xs text-gold-800">
            À venir
          </span>
        )}
        {event.status === "termine" && (
          <span className="rounded-full bg-forest-100 px-2.5 py-1 text-xs text-forest-600">
            Terminé
          </span>
        )}
        {event.live_type === "video" ? (
          <Video size={14} className="text-forest-400" />
        ) : (
          <Radio size={14} className="text-forest-400" />
        )}
      </div>

      <p className="mt-2 text-sm font-medium capitalize text-forest-900">
        {formatEventDateTime(event.scheduled_start)}
      </p>
      <p className="mt-0.5 text-base font-medium text-forest-900">{event.title}</p>
      {event.description && (
        <p className="mt-1 text-sm text-forest-400">{event.description}</p>
      )}
    </div>
  );
}

export default async function CalendrierPage() {
  const events = await getEvents();
  const upcoming = events
    .filter((e) => e.status === "a_venir" || e.status === "en_cours")
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());
  const past = events.filter((e) => e.status === "termine").slice(0, 20);

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Calendrier</h1>
      <p className="mt-1 text-sm text-forest-400">
        Les prochains directs et causeries du dahira, vidéo et radio.
      </p>

      <h2 className="mt-6 text-sm font-medium text-forest-900">À venir</h2>
      <div className="mt-3 flex flex-col gap-3">
        {upcoming.length > 0 ? (
          upcoming.map((e) => <EventCard key={e.id} event={e} />)
        ) : (
          <p className="text-sm text-forest-400">Aucun événement programmé pour le moment.</p>
        )}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-medium text-forest-900">Événements passés</h2>
          <div className="mt-3 flex flex-col gap-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
