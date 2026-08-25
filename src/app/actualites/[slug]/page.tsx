import { cache } from "react";
import { notFound } from "next/navigation";
import { EditorialPage } from "@/components/ui/editorial-page";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { NewsRow } from "@/lib/types/database";

const categoryLabels: Record<NewsRow["category"], string> = {
  annonces: "Annonces",
  evenements: "Événements",
  communiques: "Communiqués",
  vie_du_dahira: "Vie du dahira",
};

// `cache` évite d'interroger deux fois la base : generateMetadata et la
// page demandent la même entrée.
const getNewsBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
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
  const item = await getNewsBySlug(slug);
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
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const date = news.published_at
    ? new Date(news.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <EditorialPage
      category={categoryLabels[news.category]}
      title={news.title}
      date={date}
      author={news.profiles?.full_name}
      coverImageUrl={news.cover_image_url}
      excerpt={news.excerpt}
      body={news.body}
      backHref="/actualites"
      backLabel="Toutes les actualités"
    />
  );
}
