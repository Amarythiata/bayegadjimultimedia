import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MediaForm } from "../media-form";
import { updateMedia } from "../actions";

export default async function EditerMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: media } = await supabase.from("medias").select("*").eq("id", id).single();

  if (!media) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Modifier le média</h1>
      <MediaForm media={media} action={updateMedia.bind(null, id)} />
    </div>
  );
}
