"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlayCircle } from "lucide-react";
import { useLiveStatus } from "@/lib/use-live-status";

// « Accueil » est volontairement absent : le logo y mène, comme partout ailleurs
// sur le web. « À propos » et « Contact », consultés une fois et non à chaque
// visite, vivent en pied de page.
const links = [
  { href: "/radio", label: "Radio" },
  { href: "/actualites", label: "Actualités" },
  { href: "/articles", label: "Articles" },
  { href: "/medias", label: "Médiathèque" },
  { href: "/calendrier", label: "Calendrier" },
];

export function TopNav() {
  const pathname = usePathname();
  const isLive = useLiveStatus();

  return (
    // Hauteur fixée à 3.5rem : la barre latérale du back-office s'y adosse
    // via un calc(100vh - 3.5rem).
    <header className="sticky top-0 z-40 hidden h-14 border-b border-forest-900/40 bg-forest-800/95 backdrop-blur md:block">
      {/* Pas de conteneur centré : le logo doit toucher le bord gauche, au
          même retrait que la barre latérale du back-office (px-4). */}
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-xs font-bold text-forest-900">
            AL
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Ansaroudine Linguère
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors duration-200 ${
                  active
                    ? "bg-white/10 font-medium text-white"
                    : "text-forest-100/75 hover:bg-white/5 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* Écouter le direct est l'action la plus recherchée : elle se
              distingue au lieu de se fondre parmi les autres liens. Le rouge
              est réservé au signal « en direct » par la charte du projet. */}
          <Link
            href="/direct"
            aria-current={pathname.startsWith("/direct") ? "page" : undefined}
            className={`ml-3 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:brightness-105 active:scale-[0.98] ${
              isLive ? "bg-live-500 text-white" : "bg-gold-400 text-forest-900"
            }`}
          >
            {isLive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                En direct
              </>
            ) : (
              <>
                <PlayCircle size={15} />
                Direct
              </>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
