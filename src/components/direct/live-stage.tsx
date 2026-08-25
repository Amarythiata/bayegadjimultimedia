import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { LiveBadge } from "@/components/ui/live-badge";
import { LivePlayer } from "@/components/live/live-player";
import { ShareButton } from "@/components/ui/share-button";
import { formatEventDate, formatEventTime } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";

/** Direct en cours : le lecteur, le badge dans le cadre vidéo, puis la fiche. */
export function LiveStage({ event }: { event: LiveEventRow }) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-card-bg p-4 md:p-6">
      {/* Le badge est confié au lecteur, qui le place dans le cadre vidéo :
          au-dessus du composant entier, il retombait sur le sélecteur
          Vidéo/Radio et non sur l'image. */}
      <LivePlayer live={event} overlay={<LiveBadge viewerCount={event.viewer_count} />} />

      <div className="mt-5">
        <h2 className="text-xl font-semibold text-forest-900 md:text-2xl">{event.title}</h2>
        <p className="mt-1 text-sm text-gold-600">
          <span className="capitalize">{formatEventDate(event.scheduled_start)}</span> à{" "}
          {formatEventTime(event.scheduled_start)}
          <span className="text-forest-400"> (heure de Dakar)</span>
        </p>
        {event.description && (
          <p className="mt-2 text-sm leading-relaxed text-forest-400">{event.description}</p>
        )}
      </div>

      <div className="mt-4 border-t border-border-subtle pt-4">
        <ShareButton title={`En direct : ${event.title}`} />
      </div>
    </section>
  );
}

/** Aucune session : ni lecteur, ni compte à rebours à afficher. */
export function EmptyStage() {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-border-subtle bg-card-bg px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
        <CalendarDays size={24} />
      </span>
      <p className="mt-4 text-base font-semibold text-forest-900">
        Aucune retransmission programmée
      </p>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-forest-400">
        La radio, elle, diffuse en continu — et les enregistrements précédents restent
        disponibles dans la médiathèque.
      </p>
      <Link
        href="/calendrier"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-800"
      >
        <CalendarDays size={15} />
        Consulter le calendrier
      </Link>
    </section>
  );
}
