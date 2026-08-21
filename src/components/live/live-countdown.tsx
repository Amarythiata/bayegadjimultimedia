"use client";

import { useSyncExternalStore } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(target: string, now: number): Remaining {
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

// La valeur doit rester stable entre deux rendus d'une même seconde, sinon
// useSyncExternalStore boucle indéfiniment.
let cachedSecond = -1;
function getSnapshot(): number {
  const second = Math.floor(Date.now() / 1000);
  if (second !== cachedSecond) cachedSecond = second;
  return cachedSecond;
}

// Le serveur ne connaît pas l'heure du visiteur : il rend un état neutre, que
// le client remplace après hydratation. Évite l'écart de texte serveur/client.
function getServerSnapshot(): null {
  return null;
}

export function LiveCountdown({ scheduledStart }: { scheduledStart: string }) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining = nowSeconds === null ? null : getRemaining(scheduledStart, nowSeconds * 1000);

  const units = [
    { value: remaining?.days, label: "jours" },
    { value: remaining?.hours, label: "heures" },
    { value: remaining?.minutes, label: "min" },
    { value: remaining?.seconds, label: "sec" },
  ];

  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-border-subtle bg-card-bg p-4">
      {units.map((u) => (
        <div key={u.label} className="flex-1 text-center">
          <p className="text-2xl font-medium tabular-nums text-forest-900">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </p>
          <p className="text-[11px] text-forest-400">{u.label}</p>
        </div>
      ))}
    </div>
  );
}
