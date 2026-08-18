import Link from "next/link";
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
      className="flex gap-3 rounded-xl border border-border-subtle bg-card-bg p-3"
    >
      <div className="h-16 w-16 shrink-0 rounded-lg bg-forest-100" aria-hidden />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gold-600">
          {categoryLabels[news.category]}
          {date && <span className="text-forest-400"> · {date}</span>}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-forest-900">{news.title}</p>
      </div>
    </Link>
  );
}
