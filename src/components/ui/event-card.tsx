import Link from "next/link";
import { ArrowRight, Radio, Video } from "lucide-react";
import { LiveBadge } from "@/components/ui/live-badge";
import { formatEventParts, formatEventDate } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";

export function EventCard({ event }: { event: LiveEventRow }) {
  const { day, month, time } = formatEventParts(event.scheduled_start);
  const isPast = event.status === "termine";

  const card = (
    <div
      className={`flex gap-4 rounded-2xl border border-border-subtle bg-card-bg p-4 transition-colors ${
        isPast ? "opacity-75" : "hover:border-forest-400"
      }`}
    >
      {/* Vignette de date : le jour et le mois sont ce qu'on cherche d'abord
          en parcourant un calendrier, avant même le titre. */}
      <div
        className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-3 ${
          isPast ? "bg-forest-50 text-forest-400" : "bg-forest-900 text-white"
        }`}
      >
        <span className="text-xl font-semibold tabular-nums leading-none">{day}</span>
        <span className="mt-1 text-[11px] uppercase tracking-wide">
          {month.replace(".", "")}
        </span>
        <span
          className={`mt-1.5 text-[11px] tabular-nums ${
            isPast ? "text-forest-400" : "text-forest-100/70"
          }`}
        >
          {time}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {event.status === "en_cours" && <LiveBadge viewerCount={event.viewer_count} />}
          {event.status === "a_venir" && (
            <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-medium text-gold-800">
              À venir
            </span>
          )}
          {isPast && (
            <span className="rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-medium text-forest-400">
              Terminé
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-forest-400">
            {event.live_type === "video" ? <Video size={12} /> : <Radio size={12} />}
            {event.live_type === "video" ? "Vidéo" : "Radio"}
          </span>
        </div>

        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-forest-900 md:text-base">
          {event.title}
        </h3>

        <p className="mt-0.5 text-xs capitalize text-forest-400">
          {formatEventDate(event.scheduled_start)}
        </p>

        {event.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-forest-400 md:text-sm">
            {event.description}
          </p>
        )}

        {!isPast && (
          <span className="mt-2 flex items-center gap-1 text-xs font-medium text-forest-600">
            {event.status === "en_cours" ? "Regarder maintenant" : "Voir la page du direct"}
            <ArrowRight size={13} />
          </span>
        )}
      </div>
    </div>
  );

  // Un événement passé ne mène nulle part : la page /direct n'affiche que la
  // session en cours ou la suivante, le lien serait trompeur.
  return isPast ? card : <Link href="/direct">{card}</Link>;
}
