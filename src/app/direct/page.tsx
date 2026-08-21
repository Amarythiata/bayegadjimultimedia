import Link from "next/link";
import { CalendarDays, MonitorPlay, Radio as RadioIcon, PlaySquare, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LiveBadge } from "@/components/ui/live-badge";
import { LivePlayer } from "@/components/live/live-player";
import { LiveChat } from "@/components/live/live-chat";
import { LiveCountdown } from "@/components/live/live-countdown";
import { YOUTUBE_LIVE_STREAMS_URL } from "@/lib/youtube";
import type { LiveEventRow } from "@/lib/types/database";

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

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Comment suivre une retransmission — affiché quand aucun direct n'est en cours. */
function AccessSteps() {
  const steps = [
    {
      icon: Bell,
      title: "Sur cette page",
      text: "Le lecteur s'affiche automatiquement dès le début de la retransmission. Aucune inscription n'est nécessaire.",
    },
    {
      icon: RadioIcon,
      title: "En radio",
      text: "La radio du dahira diffuse en continu, y compris pendant les directs. Elle consomme beaucoup moins de données que la vidéo.",
    },
    {
      icon: MonitorPlay,
      title: "Sur YouTube",
      text: "Les directs sont également retransmis sur la chaîne officielle, où vous pouvez activer les notifications.",
    },
    {
      icon: PlaySquare,
      title: "En différé",
      text: "Les enregistrements des sessions passées sont disponibles dans la médiathèque.",
    },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-sm font-medium text-forest-900">Comment suivre nos directs</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-border-subtle bg-card-bg p-4"
          >
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-gold-600" />
              <p className="text-sm font-medium text-forest-900">{title}</p>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-forest-400">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/radio"
          className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900"
        >
          <RadioIcon size={15} />
          Écouter la radio
        </Link>
        <a
          href={YOUTUBE_LIVE_STREAMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-medium text-forest-600 hover:text-forest-900"
        >
          <MonitorPlay size={15} />
          Voir la chaîne YouTube
        </a>
        <Link
          href="/medias"
          className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-sm font-medium text-forest-600 hover:text-forest-900"
        >
          <PlaySquare size={15} />
          Médiathèque
        </Link>
      </div>
    </div>
  );
}

export default async function DirectPage() {
  const { current, next } = await getLiveState();

  // --- Un direct est en cours ---
  if (current) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <LiveBadge viewerCount={current.viewer_count} />
            <h1 className="mt-3 text-xl font-medium text-forest-900">{current.title}</h1>
            {current.description && (
              <p className="mt-1 text-sm text-forest-400">{current.description}</p>
            )}
            <LivePlayer live={current} />
          </div>

          <aside className="flex flex-col rounded-2xl border border-border-subtle bg-card-bg">
            <LiveChat liveEventId={current.id} disabled={false} />
          </aside>
        </div>
      </div>
    );
  }

  // --- Aucun direct en cours ---
  return (
    <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Direct</h1>

      {next ? (
        <div className="mt-4 rounded-2xl border border-border-subtle bg-card-bg p-6 md:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-800">
            <CalendarDays size={13} />
            Prochaine session
          </span>

          <h2 className="mt-3 text-lg font-medium text-forest-900 md:text-xl">{next.title}</h2>
          {next.description && (
            <p className="mt-1 text-sm text-forest-400">{next.description}</p>
          )}

          <p className="mt-3 text-sm text-forest-800">
            <span className="capitalize">{formatFullDate(next.scheduled_start)}</span> à{" "}
            {formatTime(next.scheduled_start)}
            <span className="text-forest-400"> (heure de Dakar)</span>
          </p>

          <LiveCountdown scheduledStart={next.scheduled_start} />
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border-subtle bg-card-bg p-6 text-center md:p-10">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-50">
            <CalendarDays size={22} className="text-forest-400" />
          </span>
          <p className="mt-4 text-base font-medium text-forest-900">
            Aucune retransmission en cours
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-forest-400">
            Aucune session n&apos;est programmée pour le moment. La radio, elle, diffuse en
            continu — et les enregistrements précédents restent disponibles.
          </p>
          <Link
            href="/calendrier"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-800"
          >
            <CalendarDays size={15} />
            Consulter le calendrier
          </Link>
        </div>
      )}

      <AccessSteps />
    </div>
  );
}
