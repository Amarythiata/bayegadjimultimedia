"use client";

import { useState, type ReactNode } from "react";
import { Video, Radio } from "lucide-react";
import type { LiveEventRow } from "@/lib/types/database";
import { YOUTUBE_LIVE_EMBED_URL } from "@/lib/youtube";

export function LivePlayer({
  live,
  overlay,
}: {
  live: LiveEventRow;
  // Rendu *dans* le cadre vidéo. Placer un badge par-dessus le composant
  // entier le ferait atterrir sur le sélecteur Vidéo/Radio, pas sur l'image.
  overlay?: ReactNode;
}) {
  const [mode, setMode] = useState<"video" | "radio">(live.live_type);

  // Repli sur la chaîne YouTube et le flux AzuraCast permanents : un direct
  // planifié sans URL explicite reste diffusable.
  const videoUrl = live.video_embed_url || YOUTUBE_LIVE_EMBED_URL;
  const radioUrl = live.radio_stream_url || process.env.NEXT_PUBLIC_RADIO_STREAM_URL;
  const canToggle = Boolean(videoUrl) && Boolean(radioUrl);

  return (
    <div className="mt-4">
      {canToggle && (
        <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setMode("video")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
              mode === "video" ? "bg-gold-400 text-forest-900" : "text-forest-100/70 hover:text-white"
            }`}
          >
            <Video size={14} /> Vidéo
          </button>
          <button
            onClick={() => setMode("radio")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
              mode === "radio" ? "bg-gold-400 text-forest-900" : "text-forest-100/70 hover:text-white"
            }`}
          >
            <Radio size={14} /> Radio
            <span className="hidden rounded bg-white/10 px-1 text-[10px] sm:inline">
              faible bande passante
            </span>
          </button>
        </div>
      )}

      {mode === "video" ? (
        <div className="relative aspect-video overflow-hidden rounded-xl">
          {overlay && (
            <div className="pointer-events-none absolute left-3 top-3 z-10">{overlay}</div>
          )}
          <iframe
            src={videoUrl}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={live.title}
          />
        </div>
      ) : radioUrl ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-white">
          <audio controls autoPlay className="w-full" src={radioUrl}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-10 text-sm text-forest-100/70">
          Flux radio momentanément indisponible.
        </div>
      )}
    </div>
  );
}
