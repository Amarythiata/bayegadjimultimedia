"use client";

import Link from "next/link";
import { Headphones, CalendarDays, Video, Radio as RadioIcon, ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import { formatEventParts } from "@/lib/dates";
import type { LiveEventRow } from "@/lib/types/database";


export function RadioCalendarBand({ upcoming }: { upcoming: LiveEventRow[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-forest-900 p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold-400/20 blur-[90px]" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Headphones size={22} className="text-gold-400" />
              </span>
              <h2 className="mt-6 text-2xl font-medium tracking-tight md:text-3xl">
                La radio du dahira, en direct
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-100/80 md:text-base">
                Causeries, cours et Gamou en continu — accessible gratuitement partout dans le
                monde, sans limite de portée.
              </p>
            </div>
            <Link
              href="/radio"
              className="group relative mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-medium text-forest-900 transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
            >
              Écouter maintenant
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col rounded-3xl border border-border-subtle bg-card-bg p-8 md:p-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100">
                <CalendarDays size={22} className="text-forest-600" />
              </span>
              <h2 className="text-xl font-medium tracking-tight text-forest-900 md:text-2xl">
                À venir
              </h2>
            </div>

            <div className="mt-6 flex-1">
              {upcoming.length > 0 ? (
                <div className="flex flex-col divide-y divide-border-subtle">
                  {upcoming.map((e) => {
                    const { day, month, time } = formatEventParts(e.scheduled_start);
                    return (
                      <div key={e.id} className="flex items-center gap-4 py-3 first:pt-0">
                        <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-forest-50 py-1.5">
                          <span className="text-base font-medium leading-none text-forest-900">
                            {day}
                          </span>
                          <span className="text-[10px] uppercase text-forest-400">{month}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-forest-900">
                            {e.title}
                          </p>
                          <p className="text-xs text-forest-400">{time}</p>
                        </div>
                        {e.live_type === "video" ? (
                          <Video size={15} className="shrink-0 text-forest-300" />
                        ) : (
                          <RadioIcon size={15} className="shrink-0 text-forest-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-sm text-forest-400">
                  Aucun événement programmé pour le moment.
                </p>
              )}
            </div>

            <Link
              href="/calendrier"
              className="group mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gold-600 transition-colors hover:text-gold-800"
            >
              Voir le calendrier complet
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
