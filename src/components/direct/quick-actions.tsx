import Link from "next/link";
import { ChevronRight, MonitorPlay, PlaySquare, Radio } from "lucide-react";
import { YOUTUBE_LIVE_STREAMS_URL } from "@/lib/youtube";

const actions = [
  {
    icon: Radio,
    title: "Écouter la radio",
    text: "Diffusion 24h/24 du dahira",
    href: "/radio",
    external: false,
  },
  {
    icon: MonitorPlay,
    title: "Voir la chaîne YouTube",
    text: "Abonnez-vous pour être prévenu",
    href: YOUTUBE_LIVE_STREAMS_URL,
    external: true,
  },
  {
    icon: PlaySquare,
    title: "Accéder à la médiathèque",
    text: "Revivez nos sessions passées",
    href: "/medias",
    external: false,
  },
];

const card =
  "group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:border-gold-400/40";

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {actions.map(({ icon: Icon, title, text, href, external }) => {
        const body = (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">
              <Icon size={17} />
            </span>
            {/* Pas de troncature : « Voir la chaîne YouTube » se réduisait à
                « Voir la chaîne Yo… » dans une colonne étroite. */}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug text-white">{title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-forest-100/60">{text}</span>
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-forest-100/40 transition-transform group-hover:translate-x-0.5"
            />
          </>
        );

        return external ? (
          <a key={title} href={href} target="_blank" rel="noopener noreferrer" className={card}>
            {body}
          </a>
        ) : (
          <Link key={title} href={href} className={card}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
