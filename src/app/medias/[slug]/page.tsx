import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MediaRow } from "@/lib/types/database";

const categoryLabels: Record<MediaRow["category"], string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

async function getMediaBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("medias")
    .select("*, profiles(full_name)")
    .eq("slug", slug)
    .maybeSingle();

  return data;
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

      <p className="mt-4 text-sm leading-relaxed text-forest-800">{media.description}</p>
    </div>
  );
}
