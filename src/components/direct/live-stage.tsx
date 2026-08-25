import { CalendarDays, MonitorPlay } from "lucide-react";
import { LiveBadge } from "@/components/ui/live-badge";
import { LivePlayer } from "@/components/live/live-player";
import { ShareButton } from "@/components/ui/share-button";
import { formatEventDate, formatEventTime } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";

/** Pastille d'identité : reprend la marque « AL » du site plutôt qu'un logo
 *  qui n'existe pas encore en fichier. */
function Mark() {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-base font-bold tracking-tight text-forest-900">
      AL
    </span>
  );
}

function SessionCard({
  event,
  shareTitle,
}: {
  event: LiveEventRow;
  shareTitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5">
      <div className="flex items-start gap-4">
        <Mark />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gold-400">
            Ansaroudine Linguère
          </p>
          <h2 className="mt-0.5 text-lg font-semibold text-white md:text-xl">{event.title}</h2>
          <p className="mt-1 text-sm text-forest-100/70">
            <span className="capitalize">{formatEventDate(event.scheduled_start)}</span> à{" "}
            {formatEventTime(event.scheduled_start)}
            <span className="text-forest-100/50"> (heure de Dakar)</span>
          </p>
          {event.description && (
            <p className="mt-2 text-sm leading-relaxed text-forest-100/70">{event.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <ShareButton tone="dark" title={shareTitle} />
      </div>
    </div>
  );
}

/** Direct en cours : le lecteur, surmonté du badge rouge. */
export function LiveStage({ event }: { event: LiveEventRow }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Un seul badge, sur l'image : le titre dit déjà que le direct est en
          cours, deux pastilles rouges côte à côte ne sont que du bruit. */}
      <div>
        <h1 className="text-xl font-semibold text-white md:text-2xl">Direct en cours</h1>
        <p className="mt-1 text-sm text-forest-100/60">
          Retransmission en direct depuis Linguère.
        </p>
      </div>

      {/* Le badge est confié au lecteur, qui le place dans le cadre vidéo. */}
      <LivePlayer live={event} overlay={<LiveBadge viewerCount={event.viewer_count} />} />

      <SessionCard event={event} shareTitle={`En direct : ${event.title}`} />
    </div>
  );
}

/** Session programmée : panneau d'attente à la place du lecteur.
 *  Le titre, la date et le partage vivent dans la colonne de droite —
 *  les répéter ici affichait deux fois la même information. */
export function WaitingStage({ event }: { event: LiveEventRow }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-white md:text-2xl">Prochaine retransmission</h1>
        <p className="mt-1 text-sm text-forest-100/60">
          Le lecteur s&apos;ouvrira ici dès le début du direct.
        </p>
      </div>

      <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 70% at 50% 30%, #123726 0%, #0a2318 60%, #071912 100%)",
          }}
        />
        <div className="relative flex flex-col items-center px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gold-400">
            <MonitorPlay size={26} />
          </span>
          <p className="mt-4 text-base font-medium text-white">En attente du direct</p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-forest-100/60">
            La retransmission n&apos;a pas encore commencé. En attendant, la radio du dahira
            diffuse en continu.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Aucune session : ni lecteur, ni compte à rebours à afficher. */
export function EmptyStage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-white md:text-2xl">Direct</h1>
        <p className="mt-1 text-sm text-forest-100/60">
          Aucune retransmission en cours ni programmée.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gold-400">
          <CalendarDays size={26} />
        </span>
        <p className="mt-4 text-base font-medium text-white">Rien à l&apos;antenne pour l&apos;instant</p>
        <p className="mt-1 max-w-md text-sm leading-relaxed text-forest-100/60">
          La radio, elle, diffuse en continu — et les enregistrements précédents restent
          disponibles dans la médiathèque.
        </p>
      </div>
    </div>
  );
}
