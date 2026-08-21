import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ShareButton } from "@/components/ui/share-button";
import type { MediaRow } from "@/lib/types/database";

const categoryLabels: Record<MediaRow["category"], string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

// `cache` évite d'interroger deux fois la base : generateMetadata et la page
// elle-même demandent le même média.
const getMediaBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("medias")
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
  const media = await getMediaBySlug(slug);
  if (!media) return {};

  return {
    title: media.title,
    description: media.description,
    openGraph: {
      type: "video.other",
      title: media.title,
      description: media.description,
      // Vignette propre au média : partager une vidéo doit montrer cette
      // vidéo, pas l'image générique du site.
      images: media.cover_image_url ? [media.cover_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: media.title,
      description: media.description,
      images: media.cover_image_url ? [media.cover_image_url] : undefined,
    },
  };
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const media = await getMediaBySlug(slug);

  if (!media) {
    notFound();
  }

  const date = media.published_at
    ? new Date(media.published_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 md:px-6 md:py-8">
      <Link href="/medias" className="text-sm text-forest-600 hover:text-forest-900">
        ← Toute la médiathèque
      </Link>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gold-600">
        {categoryLabels[media.category]}
        {date && <span className="normal-case tracking-normal text-forest-400"> · {date}</span>}
      </p>

      <h1 className="mt-1 text-xl font-medium text-forest-900 md:text-2xl">{media.title}</h1>

      {media.profiles?.full_name && (
        <p className="mt-1 text-sm text-forest-400">Ajouté par {media.profiles.full_name}</p>
      )}

      <div className="mt-4">
        {media.media_type === "video" ? (
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={media.media_url}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={media.title}
            />
          </div>
        ) : (
          <div className="rounded-xl bg-forest-900 p-5 text-white">
            <audio controls className="w-full" src={media.media_url}>
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <ShareButton title={media.title} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-forest-800">{media.description}</p>
    </div>
  );
}
