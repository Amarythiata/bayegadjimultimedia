import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsRow } from "@/lib/types/database";

const categoryLabels: Record<NewsRow["category"], string> = {
  annonces: "Annonces",
  evenements: "Événements",
  communiques: "Communiqués",
  vie_du_dahira: "Vie du dahira",
};

export function NewsCard({ news }: { news: NewsRow }) {
  const date = news.published_at
    ? new Date(news.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <Link
      href={`/actualites/${news.slug}`}
      className="group flex overflow-hidden rounded-2xl border border-border-subtle bg-card-bg transition-colors hover:border-forest-400"
    >
      {/* Visuel carré à gauche. Sans couverture, un aplat vert forêt portant
          l'initiale du dahira vaut mieux qu'un cadre vide. */}
      <div className="relative w-28 shrink-0 self-stretch bg-forest-800 sm:w-36">
        {news.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL libre saisie par un admin, pas de domaine fixe à autoriser
          <img
            src={news.cover_image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gold-400">
            AL
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gold-600">
          {categoryLabels[news.category]}
          {date && <span className="font-normal normal-case text-forest-400"> · {date}</span>}
        </p>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-forest-900 md:text-base">
          {news.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-forest-400 md:text-sm">
          {news.excerpt}
        </p>

        <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-medium text-forest-600 group-hover:text-forest-900">
          Lire la suite
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
