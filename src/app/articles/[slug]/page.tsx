import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { ArticleRow } from "@/lib/types/database";

const categoryLabels: Record<ArticleRow["category"], string> = {
  croyance: "Croyance",
  jurisprudence: "Jurisprudence",
  spiritualite: "Spiritualité",
  histoire: "Histoire",
  biographie: "Biographie",
  enseignements: "Enseignements",
};

// `cache` évite d'interroger deux fois la base : generateMetadata et la
// page demandent la même entrée.
const getArticleBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, profiles(full_name)")
    .eq("slug", slug)
    .maybeSingle();

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArticleBySlug(slug);
  if (!item) return {};

  const images = item.cover_image_url ? [item.cover_image_url] : undefined;
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      images,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 md:py-8">
      <Link href="/articles" className="text-sm text-forest-600 hover:text-forest-900">
        ← Tous les articles
      </Link>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gold-600">
        {categoryLabels[article.category]}
        {date && <span className="normal-case tracking-normal text-forest-400"> · {date}</span>}
      </p>

      <h1 className="mt-1 text-xl font-medium text-forest-900 md:text-2xl">{article.title}</h1>

      {article.profiles?.full_name && (
        <p className="mt-1 text-sm text-forest-400">Par {article.profiles.full_name}</p>
      )}

      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element -- URL libre saisie par un admin, pas de domaine fixe à autoriser
        <img
          src={article.cover_image_url}
          alt=""
          className="mt-4 aspect-video w-full rounded-2xl object-cover"
        />
      )}

      <p className="mt-4 text-base text-forest-800">{article.excerpt}</p>

      <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-forest-800">
        {article.body}
      </div>
    </div>
  );
}
