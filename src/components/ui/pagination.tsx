import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Fenêtre de pages autour de la page courante, avec ellipses aux extrémités. */
function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const cell =
  "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors";

export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  /** Filtres à conserver d'une page à l'autre (catégorie, recherche). */
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const search = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([k, v]) => {
      if (v) search.set(k, v);
    });
    if (p > 1) search.set("page", String(p));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="Page précédente"
          className={`${cell} border border-border-subtle text-forest-600 hover:border-forest-400`}
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span aria-hidden className={`${cell} border border-border-subtle text-forest-400/40`}>
          <ChevronLeft size={16} />
        </span>
      )}

      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={`${cell} text-forest-400`}>
            …
          </span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className={`${cell} bg-forest-900 font-medium text-white`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            className={`${cell} border border-border-subtle text-forest-600 hover:border-forest-400`}
          >
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          aria-label="Page suivante"
          className={`${cell} border border-border-subtle text-forest-600 hover:border-forest-400`}
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span aria-hidden className={`${cell} border border-border-subtle text-forest-400/40`}>
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
