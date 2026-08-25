"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { History, Loader, Music, Pause, Play, RotateCw, Users, Volume2, VolumeX } from "lucide-react";
import { useRadioStation } from "@/lib/use-radio-station";
import { formatDuration } from "@/lib/radio";
import { ShareButton } from "@/components/ui/share-button";

const EASE = [0.16, 1, 0.3, 1] as const;
const STREAM_URL = process.env.NEXT_PUBLIC_RADIO_STREAM_URL;

/**
 * Barres d'égaliseur décoratives.
 *
 * Elles n'analysent pas le signal : lire les fréquences réelles imposerait de
 * router le flux dans un AudioContext, ce qui coupe le son si la requête
 * inter-domaine échoue. Le risque ne vaut pas l'exactitude d'une décoration.
 */
function Equalizer({ active }: { active: boolean }) {
  // Hauteurs fixes plutôt que tirées au hasard : le rendu serveur et le rendu
  // navigateur doivent produire le même balayage.
  const bars = [38, 62, 45, 88, 54, 72, 40, 95, 60, 48, 80, 35, 68, 52, 90, 44];

  return (
    <div className="flex h-8 items-end gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-signal-400/70"
          style={{
            height: active ? `${h}%` : "12%",
            transition: "height .35s cubic-bezier(.16,1,.3,1)",
            animation: active ? `radio-bar 1.1s ease-in-out ${i * 0.07}s infinite alternate` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function RadioConsole() {
  const { station, elapsed, failed, refresh } = useRadioStation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    setLoading(true);
    try {
      // Un flux continu se reprend toujours à l'instant présent : recharger la
      // source évite de rejouer le tampon accumulé pendant la pause.
      audio.load();
      await audio.play();
    } catch {
      setLoading(false);
    }
  };

  const resync = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setLoading(true);
    audio.load();
    try {
      await audio.play();
    } catch {
      setLoading(false);
    }
  };

  const track = station?.nowPlaying;
  const quality =
    station?.bitrate && station.format
      ? `${station.format} ${station.bitrate} kbps`
      : null;
  const progress =
    station && station.duration > 0 ? Math.min(elapsed / station.duration, 1) : 0;

  return (
    <section className="px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-radio-line bg-white/5 backdrop-blur-md"
      >
        <div className="flex flex-col gap-6 p-5 md:p-7">
          {/* En-tête : identité de la station et audience réelle */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-signal-400/15 text-signal-400">
                <Music size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide text-signal-400">
                  RADIO ANSAROUDINE
                </p>
                <p className="truncate text-xs text-radio-400">
                  Écoute en direct{quality ? ` · ${quality}` : ""}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-radio-line bg-white/5 px-2.5 py-1 text-xs text-radio-100">
              <Users size={13} className="text-signal-400" />
              <span className="tabular-nums">{station?.listeners ?? "—"}</span>
              <span className="hidden sm:inline text-radio-400">à l&apos;écoute</span>
            </div>
          </div>

          {/* Titre à l'antenne */}
          <div className="flex items-center gap-4 rounded-2xl border border-radio-line bg-radio-950/50 p-4">
            <Equalizer active={playing} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-radio-400">
                {station?.isLive ? "Direct en studio" : "Maintenant"}
              </p>
              {failed ? (
                <p className="truncate text-sm text-radio-100">Station injoignable</p>
              ) : track ? (
                <>
                  <p className="truncate text-sm font-medium text-white">{track.title}</p>
                  {track.artist && (
                    <p className="truncate text-xs text-radio-400">{track.artist}</p>
                  )}
                </>
              ) : (
                <p className="truncate text-sm text-radio-400">Chargement…</p>
              )}
            </div>
            {station && station.duration > 0 && (
              <p className="hidden shrink-0 text-xs tabular-nums text-radio-400 sm:block">
                {formatDuration(elapsed)} / {formatDuration(station.duration)}
              </p>
            )}
          </div>

          {/* Progression du titre en cours */}
          {station && station.duration > 0 && (
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-signal-400 transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}

          {/* Commandes */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                disabled={!STREAM_URL}
                aria-label={playing ? "Mettre en pause" : "Écouter la radio"}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-400 text-radio-950 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-400 disabled:opacity-40"
              >
                {loading && !playing ? (
                  <Loader size={22} className="animate-spin" />
                ) : playing ? (
                  <Pause size={22} fill="currentColor" />
                ) : (
                  <Play size={22} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={resync}
                title="Revenir au direct"
                aria-label="Revenir au direct"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-radio-line text-radio-100 transition-colors hover:border-signal-400/50 hover:text-signal-400"
              >
                <RotateCw size={16} />
              </button>

              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                aria-expanded={showHistory}
                aria-label="Récemment diffusé"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  showHistory
                    ? "border-signal-400/50 text-signal-400"
                    : "border-radio-line text-radio-100 hover:border-signal-400/50 hover:text-signal-400"
                }`}
              >
                <History size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Rétablir le son" : "Couper le son"}
                className="text-radio-400 transition-colors hover:text-signal-400"
              >
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setMuted(false);
                }}
                aria-label="Volume"
                className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/15 accent-signal-400"
              />
            </div>
          </div>

          {/* Récemment diffusé — historique réel fourni par la station */}
          {showHistory && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="divide-y divide-radio-line overflow-hidden rounded-2xl border border-radio-line"
            >
              {station && station.history.length > 0 ? (
                station.history.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                    <History size={13} className="shrink-0 text-radio-400" />
                    <span className="truncate text-sm text-radio-100">{t.title}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-sm text-radio-400">
                  Aucun titre récent à afficher.
                </li>
              )}
            </motion.ul>
          )}

          <ShareButton tone="dark" title="Radio Ansaroudine — écoute en direct" />
        </div>
      </motion.div>

      {STREAM_URL && (
        <audio
          ref={audioRef}
          src={STREAM_URL}
          preload="none"
          onPlaying={() => {
            setPlaying(true);
            setLoading(false);
            refresh();
          }}
          onPause={() => setPlaying(false)}
          onWaiting={() => setLoading(true)}
          onError={() => {
            setPlaying(false);
            setLoading(false);
          }}
        />
      )}
    </section>
  );
}
