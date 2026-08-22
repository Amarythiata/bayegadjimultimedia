"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import type { LiveStatus, LiveType } from "@/lib/types/database";

function readLiveForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const liveType = String(formData.get("live_type") ?? "video") as LiveType;
  const videoEmbedUrl = String(formData.get("video_embed_url") ?? "").trim();
  const radioStreamUrl = String(formData.get("radio_stream_url") ?? "").trim();
  const scheduledStartLocal = String(formData.get("scheduled_start") ?? "");
  const status = String(formData.get("status") ?? "a_venir") as LiveStatus;

  return {
    title,
    description: description || null,
    live_type: liveType,
    // Même conversion que pour la médiathèque : un lien `watch?v=` collé
    // depuis le navigateur produirait un lecteur vide.
    video_embed_url: videoEmbedUrl ? toYouTubeEmbedUrl(videoEmbedUrl) : null,
    radio_stream_url: radioStreamUrl || null,
    scheduled_start: scheduledStartLocal ? new Date(scheduledStartLocal).toISOString() : "",
    status,
  };
}

export async function createLiveEvent(_prevState: string | undefined, formData: FormData) {
  const fields = readLiveForm(formData);

  if (!fields.title || !fields.scheduled_start) {
    return "Merci de renseigner au moins un titre et une date de début.";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("live_events").insert({
    ...fields,
    created_by: user?.id ?? null,
  });

  if (error) {
    return "Impossible de planifier ce direct.";
  }

  revalidatePath("/back-office/direct");
  revalidatePath("/direct");
  revalidatePath("/");
  redirect("/back-office/direct");
}

/**
 * Bascule le statut d'un direct depuis la liste, sans passer par le formulaire.
 *
 * Le statut n'évolue jamais tout seul : le compte à rebours peut atteindre
 * zéro sans que rien ne se passe. C'est ce geste-là qui fait apparaître le
 * lecteur sur `/direct`, il doit donc être à un clic.
 */
export async function setLiveStatus(
  id: string,
  status: LiveStatus,
  _prevState: string | undefined,
  _formData: FormData,
): Promise<string | undefined> {
  const supabase = await createClient();

  // Deux directs simultanés en « en cours » rendraient indéterminé celui que
  // le site affiche : on clôt les autres avant d'ouvrir celui-ci.
  if (status === "en_cours") {
    await supabase
      .from("live_events")
      .update({ status: "termine", ended_at: new Date().toISOString() })
      .eq("status", "en_cours")
      .neq("id", id);
  }

  const { error } = await supabase
    .from("live_events")
    .update({
      status,
      ended_at: status === "termine" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return "Impossible de changer le statut de ce direct.";
  }

  revalidatePath("/back-office/direct");
  revalidatePath("/direct");
  revalidatePath("/");
  return undefined;
}

export async function updateLiveEvent(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
) {
  const fields = readLiveForm(formData);

  if (!fields.title || !fields.scheduled_start) {
    return "Merci de renseigner au moins un titre et une date de début.";
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("live_events")
    .update({
      ...fields,
      ended_at: fields.status === "termine" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    return "Impossible de mettre à jour ce direct.";
  }

  revalidatePath("/back-office/direct");
  revalidatePath("/direct");
  revalidatePath("/");
  redirect("/back-office/direct");
}
