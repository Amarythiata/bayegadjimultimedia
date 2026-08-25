import type { Metadata } from "next";
import { Video } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LiveChat } from "@/components/live/live-chat";
import { PageHero } from "@/components/ui/page-hero";
import { LiveStage, EmptyStage } from "@/components/direct/live-stage";
import { NextSession } from "@/components/direct/next-session";
import { FollowGuide } from "@/components/direct/follow-guide";
import { QuickActions } from "@/components/direct/quick-actions";
import type { LiveEventRow } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Direct",
  description:
    "Suivez en direct les enseignements, conférences et grands rassemblements du dahira Ansaroudine de Linguère.",
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
    <div>
      <PageHero
        eyebrow="Direct"
        title="Suivez nos directs"
        subtitle="Retransmission en direct des événements religieux, conférences et grands rassemblements."
        icon={Video}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        {current ? (
          // Pendant un direct, le chat prend la colonne latérale : c'est
          // l'information utile à ce moment-là, pas le rendez-vous suivant.
          <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
            <LiveStage event={current} />
            <aside className="flex h-[28rem] flex-col rounded-2xl border border-border-subtle bg-card-bg">
              <LiveChat liveEventId={current.id} />
            </aside>
          </div>
        ) : next ? (
          <NextSession event={next} />
        ) : (
          <EmptyStage />
        )}

        <FollowGuide />
        <QuickActions />
      </div>
    </div>
  );
}
