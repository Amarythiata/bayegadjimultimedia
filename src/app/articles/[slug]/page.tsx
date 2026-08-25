import { cache } from "react";
import { notFound } from "next/navigation";
import { EditorialPage } from "@/components/ui/editorial-page";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { articleCategoryLabels as categoryLabels } from "@/lib/article-categories";

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

export default async function DetailPage({
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
    <EditorialPage
      category={categoryLabels[article.category]}
      title={article.title}
      date={date}
      author={article.profiles?.full_name}
      coverImageUrl={article.cover_image_url}
      excerpt={article.excerpt}
      body={article.body}
      backHref="/articles"
      backLabel="Tous les articles"
    />
  );
}
