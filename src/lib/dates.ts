/**
 * Les horaires de diffusion sont ceux du dahira, à Dakar.
 *
 * Sans fuseau explicite, `toLocale*` suit celui du serveur de rendu : correct
 * par hasard sur Vercel (UTC, comme Dakar), faux en développement ou sur toute
 * autre région. On le fixe donc pour que l'heure annoncée soit toujours la
 * bonne, où que le rendu ait lieu.
 */
export const DAKAR_TZ = "Africa/Dakar";

/** « lundi 24 août 2026 » */
export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DAKAR_TZ,
  });
}

/** « 10:31 » */
export function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: DAKAR_TZ,
  });
}

/** « lundi 24 août à 10:31 » */
export function formatEventDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: DAKAR_TZ,
  });
}

/** Jour, mois court et heure séparés — pour les vignettes de calendrier. */
export function formatEventParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("fr-FR", { day: "2-digit", timeZone: DAKAR_TZ }),
    month: d.toLocaleDateString("fr-FR", { month: "short", timeZone: DAKAR_TZ }),
    time: formatEventTime(iso),
  };
}
