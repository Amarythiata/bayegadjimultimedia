"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { NewsCategory, PublicationStatus } from "@/lib/types/database";

function readNewsForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as NewsCategory;
  const status = String(formData.get("status") ?? "brouillon") as PublicationStatus;

  return {
    title,
    slug: slugInput || slugify(title),
    excerpt,
    body,
    cover_image_url: coverImageUrl || null,
    category,
    status,
  };
}

export async function createNews(_prevState: string | undefined, formData: FormData) {
  const fields = readNewsForm(formData);

  if (!fields.title || !fields.excerpt || !fields.body || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("news").insert({
    ...fields,
    author_id: user?.id ?? null,
    published_at: fields.status === "publie" ? new Date().toISOString() : null,
  });

  if (error) {
    return error.message.includes("unique")
      ? "Ce slug est déjà utilisé par une autre actualité."
      : "Impossible de créer l'actualité.";
  }

  revalidatePath("/back-office/actualites");
  revalidatePath("/actualites");
  redirect("/back-office/actualites");
}

export async function updateNews(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const fields = readNewsForm(formData);

  if (!fields.title || !fields.excerpt || !fields.body || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const becomingPublished = fields.status === "publie" && existing?.status !== "publie";

  const { error } = await supabase
    .from("news")
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
      ? "Ce slug est déjà utilisé par une autre actualité."
      : "Impossible de mettre à jour l'actualité.";
  }

  revalidatePath("/back-office/actualites");
  revalidatePath("/actualites");
  redirect("/back-office/actualites");
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  await supabase.from("news").delete().eq("id", id);

  revalidatePath("/back-office/actualites");
  revalidatePath("/actualites");
}
