// Chaîne YouTube officielle du dahira — utilisée pour les retransmissions vidéo.
// L'ID de chaîne (et non le pseudo @BGM-5-LBG) est requis par l'URL d'embed
// `live_stream`, qui diffuse automatiquement le direct en cours s'il y en a un.
export const YOUTUBE_CHANNEL_ID = "UCFY-eNvn3PXpLEIgNn8RAwg";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@BGM-5-LBG";

export const YOUTUBE_LIVE_STREAMS_URL = `${YOUTUBE_CHANNEL_URL}/streams`;

/**
 * Diffuse le direct en cours de la chaîne, quel que soit l'ID de la vidéo.
 * Sert de repli quand aucune URL d'embed n'a été renseignée dans le back-office.
 */
export const YOUTUBE_LIVE_EMBED_URL = `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}`;

/**
 * Extrait l'identifiant d'une vidéo depuis n'importe quelle forme d'URL
 * YouTube : lien de partage, lien de la barre d'adresse, direct, short, ou
 * URL d'intégration déjà convertie.
 *
 * Retourne `null` si l'URL n'est pas reconnue — un fichier audio hébergé
 * ailleurs, par exemple.
 */
export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [
    /(?:youtube\.com|youtube-nocookie\.com)\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/live\/([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com|youtube-nocookie\.com)\/shorts\/([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Convertit une URL YouTube en URL d'intégration.
 *
 * Indispensable : YouTube refuse d'afficher dans une iframe les liens
 * `watch?v=` et `youtu.be`, qui sont pourtant ceux qu'on copie naturellement
 * depuis le navigateur. Les URL non-YouTube sont renvoyées inchangées.
 */
export function toYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url.trim();
}

/** Vignette officielle d'une vidéo, servie par YouTube sans clé d'API. */
export function youTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
