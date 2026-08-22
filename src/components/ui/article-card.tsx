import Link from "next/link";
import type { ArticleRow } from "@/lib/types/database";
import { articleCategoryLabels as categoryLabels } from "@/lib/article-categories";

export function ArticleCard({ article }: { article: ArticleRow }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : null;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="flex gap-3 rounded-xl border border-border-subtle bg-card-bg p-3"
    >
      <div className="h-16 w-16 shrink-0 rounded-lg bg-forest-100" aria-hidden />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gold-600">
          {categoryLabels[article.category]}
          {date && <span className="text-forest-400"> · {date}</span>}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-forest-900">{article.title}</p>
      </div>
    </Link>
  );
}
