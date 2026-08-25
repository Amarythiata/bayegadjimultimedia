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
    text: "Abonnez-vous à notre chaîne",
    href: YOUTUBE_LIVE_STREAMS_URL,
    external: true,
  },
  {
    icon: PlaySquare,
    title: "Médiathèque",
    text: "Replays et enregistrements",
    href: "/medias",
    external: false,
  },
];

const card =
  "group flex items-center gap-3 rounded-2xl border border-border-subtle bg-card-bg p-4 transition-colors hover:border-forest-400";

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {actions.map(({ icon: Icon, title, text, href, external }) => {
        const body = (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
              <Icon size={17} />
            </span>
            {/* Pas de troncature : « Voir la chaîne YouTube » se réduisait à
                « Voir la chaîne Yo… » dans une colonne étroite. */}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug text-forest-900">
                {title}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-forest-400">{text}</span>
            </span>
            <ChevronRight
              size={16}
              className="shrink-0 text-forest-400 transition-transform group-hover:translate-x-0.5"
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
