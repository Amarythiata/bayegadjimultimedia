import Link from "next/link";
import { Clock, Play, Radio } from "lucide-react";
import type { MediaRow } from "@/lib/types/database";

const categoryLabels: Record<MediaRow["category"], string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

/** `105` → `1 h 45`, `48` → `48 min`. */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

export function MediaCard({ media }: { media: MediaRow }) {
  const date = media.published_at
    ? new Date(media.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <Link
      href={`/medias/${media.slug}`}
      className="group overflow-hidden rounded-2xl border border-border-subtle bg-card-bg transition-colors hover:border-forest-400"
    >
      <div className="relative aspect-video bg-forest-800">
        {media.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- vignette YouTube ou URL libre saisie par un admin
          <img
            src={media.cover_image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gold-400">
            <Radio size={28} />
          </span>
        )}

        {/* Pastille de lecture : indique qu'un contenu se joue, et signale
            l'état survolé sur un lien qui n'a pas d'autre affordance. */}
        <span className="absolute inset-0 flex items-center justify-center bg-forest-900/25 transition-colors group-hover:bg-forest-900/40">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-forest-900 transition-transform group-hover:scale-105">
            {media.media_type === "video" ? (
              <Play size={17} fill="currentColor" className="ml-0.5" />
            ) : (
              <Radio size={17} />
            )}
          </span>
        </span>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-600">
          {categoryLabels[media.category]}
          {date && <span className="font-normal normal-case text-forest-400"> · {date}</span>}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-forest-900 md:text-base">
          {media.title}
        </h3>

        {media.duration_minutes && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-forest-400">
            <Clock size={12} />
            {formatDuration(media.duration_minutes)}
          </p>
        )}
      </div>
    </Link>
  );
}
