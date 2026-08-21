"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

const links = [
  { href: "/direct", label: "Direct" },
  { href: "/radio", label: "Radio" },
  { href: "/actualites", label: "Actualités" },
  { href: "/articles", label: "Articles" },
  { href: "/medias", label: "Médiathèque" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/a-propos", label: "À propos" },
];

export function HomeFooter() {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-white">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Reveal className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold-100">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-gold-400 text-xs font-semibold text-forest-900">
                AL
              </span>
              <span className="text-sm font-medium">Ansaroudine Linguère</span>
            </div>
            <h2 className="mt-6 max-w-md text-2xl font-medium tracking-tight md:text-3xl">
              Une question, une suggestion&nbsp;? Restons en contact.
            </h2>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-forest-900 transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
          >
            Nous contacter
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-forest-100/70 transition-colors hover:text-gold-400"
            >
              {l.label}
            </Link>
          ))}
        </Reveal>

        <p className="mt-10 text-xs text-forest-100/40">
          © {new Date().getFullYear()} Dahira Ansaroudine Linguère.
        </p>
      </div>
    </section>
  );
}
