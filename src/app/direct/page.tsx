import { createClient } from "@/lib/supabase/server";
import { LiveBadge } from "@/components/ui/live-badge";
import { LivePlayer } from "@/components/live/live-player";
import { LiveChat } from "@/components/live/live-chat";
import { LiveCountdown } from "@/components/live/live-countdown";
import type { LiveEventRow } from "@/lib/types/database";

const mockLive: LiveEventRow = {
  id: "mock",
  title: "Gamou Annuel 2026 — Sokone",
  description: "Causerie religieuse depuis la grande mosquée, retransmise en vidéo et en radio.",
  cover_image_url: null,
  status: "en_cours",
  scheduled_start: new Date().toISOString(),
  ended_at: null,
  live_type: "video",
  video_embed_url: null,
  radio_stream_url: null,
  viewer_count: 1284,
  created_by: null,
  created_at: new Date().toISOString(),
};

async function getLiveEvent(): Promise<LiveEventRow> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("live_events")
      .select("*")
      .order("scheduled_start", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? mockLive;
  } catch {
    return mockLive;
  }
}

export default async function DirectPage() {
  const live = await getLiveEvent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            {live.status === "en_cours" && <LiveBadge viewerCount={live.viewer_count} />}
            {live.status === "a_venir" && (
              <span className="rounded-full bg-forest-100 px-2.5 py-1 text-xs text-forest-800">
                À venir
              </span>
            )}
            {live.status === "termine" && (
              <span className="rounded-full bg-forest-100 px-2.5 py-1 text-xs text-forest-600">
                Terminé — voir la médiathèque
              </span>
            )}
          </div>

          <h1 className="text-xl font-medium text-forest-900">{live.title}</h1>
          {live.description && (
            <p className="mt-1 text-sm text-forest-400">{live.description}</p>
          )}

          {live.status === "a_venir" ? (
            <LiveCountdown scheduledStart={live.scheduled_start} />
          ) : (
            <LivePlayer live={live} />
          )}
        </div>

        <aside className="flex flex-col rounded-2xl border border-border-subtle bg-card-bg">
          <LiveChat liveEventId={live.id} disabled={live.status !== "en_cours"} />
        </aside>
      </div>
    </div>
  );
}
