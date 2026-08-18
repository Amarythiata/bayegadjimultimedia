"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { ArticleCategory, PublicationStatus } from "@/lib/types/database";

function readArticleForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ArticleCategory;
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

export async function createArticle(_prevState: string | undefined, formData: FormData) {
  const fields = readArticleForm(formData);

  if (!fields.title || !fields.excerpt || !fields.body || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("articles").insert({
    ...fields,
    author_id: user?.id ?? null,
    published_at: fields.status === "publie" ? new Date().toISOString() : null,
  });

  if (error) {
    return error.message.includes("unique")
      ? "Ce slug est déjà utilisé par un autre article."
      : "Impossible de créer l'article.";
  }

  revalidatePath("/back-office/articles");
  revalidatePath("/articles");
  redirect("/back-office/articles");
}

export async function updateArticle(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const fields = readArticleForm(formData);

  if (!fields.title || !fields.excerpt || !fields.body || !fields.category) {
    return "Merci de remplir tous les champs obligatoires.";
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("articles")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const becomingPublished = fields.status === "publie" && existing?.status !== "publie";

  const { error } = await supabase
    .from("articles")
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
      ? "Ce slug est déjà utilisé par un autre article."
      : "Impossible de mettre à jour l'article.";
  }

  revalidatePath("/back-office/articles");
  revalidatePath("/articles");
  redirect("/back-office/articles");
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);

  revalidatePath("/back-office/articles");
  revalidatePath("/articles");
}
