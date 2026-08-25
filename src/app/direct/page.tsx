import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LiveChat } from "@/components/live/live-chat";
import { LiveStage, WaitingStage, EmptyStage } from "@/components/direct/live-stage";
import { NextSession } from "@/components/direct/next-session";
import { FollowGuide } from "@/components/direct/follow-guide";
import { QuickActions } from "@/components/direct/quick-actions";
import type { LiveEventRow } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Direct",
  description:
    "Suivez en direct les enseignements, conférences et moments forts du dahira Ansaroudine de Linguère.",
};

async function getLiveState(): Promise<{
  current: LiveEventRow | null;
  next: LiveEventRow | null;
}> {
  try {
    const supabase = await createClient();
    const [{ data: current }, { data: next }] = await Promise.all([
      supabase
        .from("live_events")
        .select("*")
        .eq("status", "en_cours")
        .order("scheduled_start", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("live_events")
        .select("*")
        .eq("status", "a_venir")
        .order("scheduled_start", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);
    return { current: current ?? null, next: next ?? null };
  } catch {
    return { current: null, next: null };
  }
}

export default async function DirectPage() {
  const { current, next } = await getLiveState();

  return (
    // Univers sombre : une page de retransmission se regarde, et un fond crème
    // autour d'une vidéo fatigue l'œil. La palette reste celle du site —
    // vert forêt et or — contrairement à /radio qui a sa propre teinte.
    <div className="min-h-screen bg-forest-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-70"
        style={{
          background: "radial-gradient(60% 100% at 50% 0%, #123726 0%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          {/* Colonne principale — ce que le visiteur vient voir */}
          <div className="flex flex-col gap-5">
            {current ? (
              <LiveStage event={current} />
            ) : next ? (
              <WaitingStage event={next} />
            ) : (
              <EmptyStage />
            )}

            <QuickActions />
          </div>

          {/* Colonne latérale — le chat pendant le direct, sinon le rendez-vous
              à venir : c'est l'information utile à chacun de ces moments. */}
          <aside className="flex flex-col gap-4">
            {current ? (
              <div className="flex h-[26rem] flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <LiveChat liveEventId={current.id} tone="dark" />
              </div>
            ) : next ? (
              <NextSession event={next} />
            ) : (
              <Link
                href="/calendrier"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-gold-400/40"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">
                  <CalendarDays size={17} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-white">
                    Consulter le calendrier
                  </span>
                  <span className="block text-xs text-forest-100/60">
                    Les prochains rendez-vous du dahira
                  </span>
                </span>
              </Link>
            )}

            <FollowGuide />
          </aside>
        </div>
      </div>
    </div>
  );
}
