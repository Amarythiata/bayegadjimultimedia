"use client";

import { Bell } from "lucide-react";
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
    <section className="rounded-2xl border border-border-subtle bg-card-bg p-5 md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full bg-gold-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold-800">
            Prochaine session
          </span>
          <h2 className="mt-2.5 text-xl font-semibold text-forest-900 md:text-2xl">
            {event.title}
          </h2>
          <p className="mt-1 text-sm text-gold-600">
            <span className="capitalize">{formatEventDate(event.scheduled_start)}</span> à{" "}
            {formatEventTime(event.scheduled_start)}
            <span className="text-forest-400"> (heure de Dakar)</span>
          </p>
          {event.description && (
            <p className="mt-2 text-sm leading-relaxed text-forest-400">{event.description}</p>
          )}
        </div>

        <div className="shrink-0 md:w-80">
          <LiveCountdown scheduledStart={event.scheduled_start} />
        </div>
      </div>

      {/* Le site n'a ni comptes ni notifications : le rappel passe par
          l'agenda du visiteur, avec une alerte trente minutes avant. */}
      <div className="mt-5 flex flex-col items-start gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-sm text-forest-400">Recevez un rappel avant le début</p>
        <button
          type="button"
          onClick={addToCalendar}
          className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600"
        >
          <Bell size={15} />
          Ajouter à mon agenda
        </button>
      </div>

      <div className="mt-4 border-t border-border-subtle pt-4">
        <ShareButton title={`${event.title} — retransmission en direct`} />
      </div>
    </section>
  );
}
