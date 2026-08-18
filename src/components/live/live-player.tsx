"use client";

import { useState } from "react";
import { Video, Radio } from "lucide-react";
import type { LiveEventRow } from "@/lib/types/database";

export function LivePlayer({ live }: { live: LiveEventRow }) {
  const [mode, setMode] = useState<"video" | "radio">(live.live_type);
  const canToggle = Boolean(live.video_embed_url) && Boolean(live.radio_stream_url);

  return (
    <div className="mt-4">
      {canToggle && (
        <div className="mb-3 inline-flex rounded-full border border-border-subtle p-1">
          <button
            onClick={() => setMode("video")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
              mode === "video" ? "bg-forest-800 text-white" : "text-forest-600"
            }`}
          >
            <Video size={14} /> Vidéo
          </button>
          <button
            onClick={() => setMode("radio")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
              mode === "radio" ? "bg-forest-800 text-white" : "text-forest-600"
            }`}
          >
            <Radio size={14} /> Radio
            <span className="rounded bg-gold-100 px-1 text-[10px] text-gold-800">
              faible bande passante
            </span>
          </button>
        </div>
      )}

      {mode === "video" ? (
        live.video_embed_url ? (
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={live.video_embed_url}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={live.title}
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-forest-900 text-sm text-forest-100">
            Flux vidéo à configurer (URL embed YouTube/Facebook Live)
          </div>
        )
      ) : live.radio_stream_url ? (
        <div className="rounded-xl bg-forest-900 p-5 text-white">
          <audio controls autoPlay className="w-full" src={live.radio_stream_url}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl bg-forest-900 p-10 text-sm text-forest-100">
          Flux radio à configurer (URL Icecast / AzuraCast)
        </div>
      )}
    </div>
  );
}
