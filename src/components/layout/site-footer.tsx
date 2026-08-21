"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const groups = [
  {
    title: "Écouter",
    links: [
      { href: "/direct", label: "Direct" },
      { href: "/radio", label: "Radio" },
    ],
  },
  {
    title: "Lire",
    links: [
      { href: "/actualites", label: "Actualités" },
      { href: "/articles", label: "Articles" },
    ],
  },
  {
    title: "Découvrir",
    links: [
      { href: "/medias", label: "Médiathèque" },
      { href: "/calendrier", label: "Calendrier" },
    ],
  },
  {
    title: "Le dahira",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

// Espaces d'administration et d'authentification : un pied de page public y
// serait hors sujet et allongerait inutilement les écrans de saisie.
const HIDDEN_ON = ["/back-office", "/connexion", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"];

export function SiteFooter() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="relative overflow-hidden bg-forest-900 text-white">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold-400/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-xs font-bold text-forest-900">
                AL
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Ansaroudine Linguère
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-forest-100/70">
              Directs vidéo et radio, actualités, médiathèque et articles — pour rester
              connecté à la vie du dahira, partout dans le monde.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-medium text-forest-900 transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
            >
              Nous contacter
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 md:gap-x-14">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium uppercase tracking-widest text-gold-400">
                  {group.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-forest-100/70 transition-colors hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-14 border-t border-white/10 pt-8 text-xs text-forest-100/40">
          © {new Date().getFullYear()} Dahira Ansaroudine Linguère.
        </p>
      </div>
    </footer>
  );
}
