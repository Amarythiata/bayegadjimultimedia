"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RADIO_API, parseStation, type RadioStation } from "@/lib/radio";

/**
 * État de la station, rafraîchi périodiquement.
 *
 * Une seule interrogation alimente le lecteur, le compteur d'auditeurs et
 * l'historique : trois appels séparés multiplieraient le trafic sans rien
 * apporter. Entre deux requêtes, la progression du titre avance localement,
 * sinon la barre resterait figée vingt secondes durant.
 */
export function useRadioStation(intervalMs = 20_000) {
  const [station, setStation] = useState<RadioStation | null>(null);
  const [failed, setFailed] = useState(false);
  const [drift, setDrift] = useState(0);

  // Permet à l'appelant de forcer une actualisation sans relancer les minuteurs.
  const loadRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(RADIO_API, { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (cancelled) return;
        setStation(parseStation(json));
        setDrift(0);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    loadRef.current = load;
    load();

    const poll = setInterval(load, intervalMs);
    const tick = setInterval(() => setDrift((d) => d + 1), 1000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [intervalMs]);

  const refresh = useCallback(() => loadRef.current(), []);

  const elapsed = station
    ? station.duration > 0
      ? Math.min(station.elapsed + drift, station.duration)
      : station.elapsed + drift
    : 0;

  return { station, elapsed, failed, refresh };
}
