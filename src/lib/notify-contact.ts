import { Resend } from "resend";

const RECIPIENT = "ansaroudinelinguere@gmail.com";

/**
 * Prévient le dahira qu'un message vient d'arriver.
 *
 * L'échec est volontairement silencieux : le message est déjà enregistré en
 * base et consultable dans le back-office. Faire échouer l'envoi du formulaire
 * parce qu'un email n'est pas parti pénaliserait le visiteur pour un incident
 * qui ne le concerne pas.
 *
 * Retourne `true` si la notification est partie, pour la journalisation.
 */
export async function notifyNewContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  // Sans domaine vérifié chez Resend, seule cette adresse d'expédition est
  // autorisée. À remplacer par contact@ansaroudinelinguere.com une fois le
  // domaine validé, ce qui améliorera aussi la délivrabilité.
  const from = process.env.CONTACT_FROM_EMAIL || "Ansaroudine Linguère <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [RECIPIENT],
      // Répondre depuis Gmail écrit directement au visiteur, sans avoir à
      // recopier son adresse.
      replyTo: input.email,
      subject: `Message de ${input.name} — site du dahira`,
      text: [
        `Nom    : ${input.name}`,
        `Email  : ${input.email}`,
        "",
        input.message,
        "",
        "—",
        "Répondre à cet email écrit directement à l'expéditeur.",
        "Message également consultable sur https://ansaroudinelinguere.com/back-office/contact",
      ].join("\n"),
    });

    if (error) {
      console.error("Notification de contact non envoyée :", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Notification de contact non envoyée :", error);
    return false;
  }
}
