import Link from "next/link";
import { Video, Radio } from "lucide-react";
import type { MediaRow } from "@/lib/types/database";

const categoryLabels: Record<MediaRow["category"], string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

export function MediaCard({ media }: { media: MediaRow }) {
  const date = media.published_at
    ? new Date(media.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <Link
      href={`/medias/${media.slug}`}
      className="flex gap-3 rounded-xl border border-border-subtle bg-card-bg p-3"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-forest-100">
        {media.cover_image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- vignette YouTube ou URL libre saisie par un admin */}
            <img
              src={media.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest-900/25 text-white">
              {media.media_type === "video" ? <Video size={18} /> : <Radio size={18} />}
            </span>
          </>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-forest-600">
            {media.media_type === "video" ? <Video size={20} /> : <Radio size={20} />}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gold-600">
          {categoryLabels[media.category]}
          {date && <span className="text-forest-400"> · {date}</span>}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-forest-900">{media.title}</p>
      </div>
    </Link>
  );
}
