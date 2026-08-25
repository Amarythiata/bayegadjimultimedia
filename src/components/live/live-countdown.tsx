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

const tones = {
  light: {
    cell: "rounded-xl border border-border-subtle bg-card-bg",
    value: "text-forest-900",
    label: "text-forest-400",
  },
  dark: {
    cell: "rounded-xl border border-white/10 bg-white/5",
    value: "text-white",
    label: "text-forest-100/60",
  },
};

export function LiveCountdown({
  scheduledStart,
  tone = "light",
}: {
  scheduledStart: string;
  tone?: keyof typeof tones;
}) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining = nowSeconds === null ? null : getRemaining(scheduledStart, nowSeconds * 1000);
  const style = tones[tone];

  const units = [
    { value: remaining?.days, label: "jours" },
    { value: remaining?.hours, label: "heures" },
    { value: remaining?.minutes, label: "min" },
    { value: remaining?.seconds, label: "sec" },
  ];

  // Chaque unité dans sa propre case : sur la maquette du direct le compte à
  // rebours doit rester lisible en colonne étroite, où un seul bloc se serre.
  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {units.map((u) => (
        <div key={u.label} className={`${style.cell} px-1 py-3 text-center`}>
          <p className={`text-xl font-semibold tabular-nums md:text-2xl ${style.value}`}>
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </p>
          <p className={`mt-0.5 text-[11px] ${style.label}`}>{u.label}</p>
        </div>
      ))}
    </div>
  );
}
