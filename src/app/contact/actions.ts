"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewContactMessage } from "@/lib/notify-contact";

export type ContactFormState = { ok: boolean; message: string } | undefined;

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Merci de remplir tous les champs." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Adresse email invalide." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });

  if (error) {
    return { ok: false, message: "Impossible d'envoyer le message, réessaie plus tard." };
  }

  // Notification après l'enregistrement : la base fait foi, l'email n'est
  // qu'une alerte. Un échec d'envoi ne doit pas perdre le message ni afficher
  // une erreur au visiteur.
  await notifyNewContactMessage({ name, email, message });

  return { ok: true, message: "Message envoyé — on te répond au plus vite." };
}
