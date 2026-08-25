/**
 * Station AzuraCast du dahira.
 *
 * L'API autorise les requêtes de toute origine : le navigateur l'interroge
 * directement, sans passer par le serveur. Toutes les caractéristiques
 * affichées sur /radio (débit, format, auditeurs, titre en cours) viennent
 * d'ici plutôt que d'être écrites en dur — une valeur codée en dur devient
 * fausse le jour où la station change de réglage.
 */
export const RADIO_API =
  "https://radio.ansaroudinelinguere.com/api/nowplaying/ansaroudinelinguere";

export type RadioTrack = {
  id: string;
  title: string;
  artist: string | null;
  playedAt: number | null;
};

export type RadioStation = {
  online: boolean;
  listeners: number;
  unique: number;
  nowPlaying: RadioTrack | null;
  /** Secondes écoulées et durée totale du titre en cours, si connues. */
  elapsed: number;
  duration: number;
  bitrate: number | null;
  format: string | null;
  isLive: boolean;
  streamer: string | null;
  history: RadioTrack[];
};

type RawSong = { id?: string; text?: string; title?: string; artist?: string };
type RawItem = { song?: RawSong; played_at?: number; duration?: number; elapsed?: number };
type RawMount = { format?: string; bitrate?: number };

type RawPayload = {
  is_online?: boolean;
  listeners?: { current?: number; unique?: number };
  now_playing?: RawItem;
  song_history?: RawItem[];
  live?: { is_live?: boolean; streamer_name?: string };
  station?: { mounts?: RawMount[] };
};

function toTrack(item: RawItem | undefined, fallbackId: string): RadioTrack | null {
  const song = item?.song;
  // `title` est vide sur les fichiers sans métadonnées : `text` prend le relais.
  const title = song?.title?.trim() || song?.text?.trim();
  if (!title) return null;

  return {
    id: song?.id || fallbackId,
    title,
    artist: song?.artist?.trim() || null,
    playedAt: typeof item?.played_at === "number" ? item.played_at : null,
  };
}

export function parseStation(raw: RawPayload): RadioStation {
  const mount = raw.station?.mounts?.[0];

  return {
    online: Boolean(raw.is_online),
    listeners: raw.listeners?.current ?? 0,
    unique: raw.listeners?.unique ?? 0,
    nowPlaying: toTrack(raw.now_playing, "now"),
    elapsed: raw.now_playing?.elapsed ?? 0,
    duration: raw.now_playing?.duration ?? 0,
    bitrate: mount?.bitrate ?? null,
    format: mount?.format?.toUpperCase() ?? null,
    isLive: Boolean(raw.live?.is_live),
    streamer: raw.live?.streamer_name?.trim() || null,
    history: (raw.song_history ?? [])
      .map((item, i) => toTrack(item, `h${i}`))
      .filter((t): t is RadioTrack => t !== null),
  };
}

/** Durée en `m:ss`, pour la progression du titre en cours. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
