"use client";

import { useEffect, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Indique si une retransmission est en cours.
 *
 * Volontairement côté client : interroger Supabase depuis le layout racine
 * lirait les cookies et rendrait dynamiques les pages aujourd'hui statiques
 * (/radio, /a-propos, /plus…), leur faisant perdre leur cache CDN. Le coût
 * serait disproportionné pour un indicateur décoratif.
 *
 * `live_events` étant publiée pour Realtime (migration 0001), on s'abonne aux
 * changements plutôt que d'interroger en boucle : la pastille apparaît et
 * disparaît sans rechargement, sans requête périodique.
 */
export function useLiveStatus(): boolean {
  const [isLive, setIsLive] = useState(false);
  // Nom de canal propre à chaque instance : TopNav et BottomNav montent tous
  // deux ce hook, et un nom partagé ferait échouer le second abonnement
  // (« cannot add postgres_changes callbacks after subscribe() »).
  const instanceId = useId();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const check = async () => {
      const { data } = await supabase
        .from("live_events")
        .select("id")
        .eq("status", "en_cours")
        .limit(1)
        .maybeSingle();
      if (!cancelled) setIsLive(Boolean(data));
    };

    check();

    const channel = supabase
      .channel(`live-status-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_events" },
        check,
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [instanceId]);

  return isLive;
}
