"use client";

import { useEffect, useState } from "react";
import { Headphones, Users, Music } from "lucide-react";

type Audience = {
  online: boolean;
  current: number;
  unique: number;
  nowPlaying: string | null;
  isLive: boolean;
  streamer: string | null;
};

const API = "https://radio.ansaroudinelinguere.com/api/nowplaying/ansaroudinelinguere";

/**
 * Audience de la radio, interrogée directement depuis le navigateur.
 *
 * L'API d'AzuraCast autorise les requêtes de toute origine, ce qui évite de
 * faire transiter l'appel par le serveur. Rafraîchissement toutes les 30 s :
 * un compteur d'auditeurs figé jusqu'au rechargement n'aurait guère d'intérêt.
 */
export function RadioAudience() {
  const [data, setData] = useState<Audience | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(API, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (cancelled) return;
        setData({
          online: Boolean(json?.is_online),
          current: json?.listeners?.current ?? 0,
          unique: json?.listeners?.unique ?? 0,
          nowPlaying: json?.now_playing?.song?.title ?? null,
          isLive: Boolean(json?.live?.is_live),
          streamer: json?.live?.streamer_name || null,
        });
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (failed) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-card-bg p-4">
        <p className="text-xs text-forest-400">Audience radio</p>
        <p className="mt-2 text-sm text-forest-600">Serveur radio injoignable.</p>
      </div>
    );
  }

  const loading = data === null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-card-bg p-4 sm:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-forest-400">
          <Headphones size={16} />
          <p className="text-xs">Audience radio</p>
        </div>
        {!loading &&
          (data.online ? (
            <span className="flex items-center gap-1.5 rounded-full bg-forest-50 px-2 py-0.5 text-[11px] text-forest-600">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-400" />
              En ligne
            </span>
          ) : (
            <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[11px] text-forest-400">
              Hors ligne
            </span>
          ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-forest-900 md:text-3xl">
            {loading ? "—" : data.current}
          </p>
          <p className="text-xs text-forest-400">à l&apos;écoute</p>
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-lg font-medium tabular-nums text-forest-600">
            <Users size={15} />
            {loading ? "—" : data.unique}
          </p>
          <p className="text-xs text-forest-400">auditeurs uniques</p>
        </div>
      </div>

      {!loading && (
        <p className="mt-3 flex items-center gap-1.5 truncate border-t border-border-subtle pt-3 text-xs text-forest-400">
          <Music size={13} className="shrink-0" />
          {data.isLive ? (
            <span className="truncate text-live-600">
              Direct en cours{data.streamer ? ` — ${data.streamer}` : ""}
            </span>
          ) : (
            <span className="truncate">{data.nowPlaying ?? "Rien à l'antenne"}</span>
          )}
        </p>
      )}
    </div>
  );
}
