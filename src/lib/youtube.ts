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
