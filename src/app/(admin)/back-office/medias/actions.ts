"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { MediaCategory, LiveType, PublicationStatus } from "@/lib/types/database";

function readMediaForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const mediaType = String(formData.get("media_type") ?? "video") as LiveType;
  const mediaUrl = String(formData.get("media_url") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as MediaCategory;
  const status = String(formData.get("status") ?? "brouillon") as PublicationStatus;

  return {
    title,
    slug: slugInput || slugify(title),
    description,
    media_type: mediaType,
    media_url: mediaUrl,
    cover_image_url: coverImageUrl || null,
    category,
    status,
  };
}

export async function createMedia(_prevState: string | undefined, formData: FormData) {
  const fields = readMediaForm(formData);

  if (!fields.title || !fields.description || !fields.media_url || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("medias").insert({
    ...fields,
    author_id: user?.id ?? null,
    published_at: fields.status === "publie" ? new Date().toISOString() : null,
  });

  if (error) {
    return error.message.includes("unique")
      ? "Ce slug est déjà utilisé par un autre média."
      : "Impossible de créer ce média.";
  }

  revalidatePath("/back-office/medias");
  revalidatePath("/medias");
  redirect("/back-office/medias");
}

export async function updateMedia(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const fields = readMediaForm(formData);

  if (!fields.title || !fields.description || !fields.media_url || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("medias")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const becomingPublished = fields.status === "publie" && existing?.status !== "publie";

  const { error } = await supabase
    .from("medias")
    .update({
      ...fields,
      published_at: becomingPublished
        ? new Date().toISOString()
        : (existing?.published_at ?? null),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return error.message.includes("unique")
      ? "Ce slug est déjà utilisé par un autre média."
      : "Impossible de mettre à jour ce média.";
  }

  revalidatePath("/back-office/medias");
  revalidatePath("/medias");
  redirect("/back-office/medias");
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();
  await supabase.from("medias").delete().eq("id", id);

  revalidatePath("/back-office/medias");
  revalidatePath("/medias");
}
