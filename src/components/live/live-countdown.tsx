"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function LiveCountdown({ scheduledStart }: { scheduledStart: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(scheduledStart));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(scheduledStart)), 1000);
    return () => clearInterval(id);
  }, [scheduledStart]);

  const units = [
    { value: remaining.days, label: "jours" },
    { value: remaining.hours, label: "heures" },
    { value: remaining.minutes, label: "min" },
    { value: remaining.seconds, label: "sec" },
  ];

  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-border-subtle bg-card-bg p-4">
      {units.map((u) => (
        <div key={u.label} className="flex-1 text-center">
          <p className="text-2xl font-medium tabular-nums text-forest-900">
            {String(u.value).padStart(2, "0")}
          </p>
          <p className="text-[11px] text-forest-400">{u.label}</p>
        </div>
      ))}
    </div>
  );
}
