"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";
import type { ArticleRow, NewsRow } from "@/lib/types/database";

const newsCategoryLabels: Record<NewsRow["category"], string> = {
  annonces: "Annonces",
  evenements: "Événements",
  communiques: "Communiqués",
  vie_du_dahira: "Vie du dahira",
};

const articleCategoryLabels: Record<ArticleRow["category"], string> = {
  croyance: "Croyance",
  jurisprudence: "Jurisprudence",
  spiritualite: "Spiritualité",
  histoire: "Histoire",
  biographie: "Biographie",
  enseignements: "Enseignements",
};

function formatShortDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function CompactRow({
  href,
  label,
  title,
  date,
}: {
  href: string;
  label: string;
  title: string;
  date: string | null;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 border-b border-border-subtle py-4 first:pt-0 last:border-b-0"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gold-600">
          {label}
          {date && <span className="text-forest-400"> · {date}</span>}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-forest-900 transition-colors duration-300 group-hover:text-gold-600 md:text-base">
          {title}
        </p>
      </div>
      <ArrowUpRight
        size={16}
        className="mt-1 shrink-0 text-forest-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-600"
      />
    </Link>
  );
}

export function FeaturedContent({
  featured,
  news,
  articles,
}: {
  featured: NewsRow | null;
  news: NewsRow[];
  articles: ArticleRow[];
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">À la une</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-forest-900 md:text-3xl">
            L&apos;actualité du dahira
          </h2>
        </div>
        <Link
          href="/actualites"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-forest-600 transition-colors hover:text-gold-600 md:flex"
        >
          Toutes les actualités
          <ArrowRight size={15} />
        </Link>
      </Reveal>

      {featured && (
        <Reveal delay={0.1} className="mt-8">
          <Link
            href={`/actualites/${featured.slug}`}
            className="group relative block overflow-hidden rounded-3xl bg-forest-900 shadow-[0_20px_60px_-15px_rgba(13,26,8,0.5)] transition-shadow duration-500 hover:shadow-[0_25px_70px_-10px_rgba(13,26,8,0.6)]"
          >
            {/* Hauteur dictée par le contenu, avec un minimum : un ratio figé
                rognait le badge dès que le titre passait sur deux lignes. */}
            <div className="relative w-full">
              {featured.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- URL libre saisie par un admin
                <img
                  src={featured.cover_image_url}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(217,154,43,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(74,107,65,0.4),transparent_55%)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/40 to-transparent" />
              <div className="relative flex min-h-[19rem] flex-col justify-end gap-3 p-6 md:min-h-[26rem] md:p-10">
                <p className="w-fit rounded-full bg-gold-400 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-forest-900">
                  {newsCategoryLabels[featured.category]}
                </p>
                <h3 className="max-w-2xl text-2xl font-medium leading-tight text-white md:text-4xl">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="max-w-xl text-sm text-forest-100/85 md:text-base">
                    {featured.excerpt}
                  </p>
                )}
                <span className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gold-400">
                  Lire l&apos;article
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      )}

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal delay={0.15}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-forest-900">Actualités récentes</h3>
            <Link href="/actualites" className="text-xs text-gold-600 hover:text-gold-800">
              Voir tout
            </Link>
          </div>
          <div className="mt-2">
            {news.length > 0 ? (
              news.map((n) => (
                <CompactRow
                  key={n.id}
                  href={`/actualites/${n.slug}`}
                  label={newsCategoryLabels[n.category]}
                  title={n.title}
                  date={formatShortDate(n.published_at)}
                />
              ))
            ) : (
              <p className="py-4 text-sm text-forest-400">Aucune actualité pour le moment.</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-forest-900">Articles</h3>
            <Link href="/articles" className="text-xs text-gold-600 hover:text-gold-800">
              Voir tout
            </Link>
          </div>
          <div className="mt-2">
            {articles.length > 0 ? (
              articles.map((a) => (
                <CompactRow
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  label={articleCategoryLabels[a.category]}
                  title={a.title}
                  date={formatShortDate(a.published_at)}
                />
              ))
            ) : (
              <p className="py-4 text-sm text-forest-400">Aucun article pour le moment.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
