"use client";

import { CalendarPlus } from "lucide-react";
import { LiveCountdown } from "@/components/live/live-countdown";
import { ShareButton } from "@/components/ui/share-button";
import { formatEventDate, formatEventTime } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";

/** Horodatage iCalendar en UTC : `20260825T163100Z`. */
function icsDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Les virgules, points-virgules et retours à la ligne sont réservés en iCalendar. */
function icsEscape(text: string): string {
  return text.replace(/([,;\\])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

export function NextSession({ event }: { event: LiveEventRow }) {
  const addToCalendar = () => {
    const start = new Date(event.scheduled_start);
    // Durée par défaut de deux heures : la base ne stocke pas d'heure de fin,
    // et un événement sans durée s'affiche mal dans la plupart des agendas.
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ansaroudine Linguere//Direct//FR",
      "BEGIN:VEVENT",
      `UID:${event.id}@ansaroudinelinguere.com`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(event.scheduled_start)}`,
      `DTEND:${icsDate(end.toISOString())}`,
      `SUMMARY:${icsEscape(event.title)}`,
      event.description ? `DESCRIPTION:${icsEscape(event.description)}` : "",
      "URL:https://ansaroudinelinguere.com/direct",
      "BEGIN:VALARM",
      "TRIGGER:-PT30M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsEscape(event.title)}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/[^\w\s-]/g, "").trim() || "direct"}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <p className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400">
        Prochaine session
      </p>

      <h2 className="mt-2 text-lg font-semibold text-white">{event.title}</h2>

      <p className="mt-1 text-sm text-forest-100/70">
        <span className="capitalize">{formatEventDate(event.scheduled_start)}</span> à{" "}
        {formatEventTime(event.scheduled_start)}
        <span className="text-forest-100/50"> (heure de Dakar)</span>
      </p>

      <LiveCountdown scheduledStart={event.scheduled_start} tone="dark" />

      {/* Un rappel dans l'agenda du visiteur vaut mieux qu'une promesse de
          notification que le site ne peut pas tenir : aucun envoi n'est
          possible sans compte ni autorisation navigateur. */}
      <button
        type="button"
        onClick={addToCalendar}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-2.5 text-sm font-medium text-forest-900 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
      >
        <CalendarPlus size={16} />
        Ajouter à mon agenda
      </button>

      <div className="mt-4 border-t border-white/10 pt-4">
        <ShareButton tone="dark" title={`${event.title} — retransmission en direct`} />
      </div>
    </div>
  );
}
