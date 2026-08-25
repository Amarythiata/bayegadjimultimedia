import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Info,
  Mail,
  MoreHorizontal,
  MonitorPlay,
} from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Plus",
  description:
    "Articles, calendrier, présentation du dahira Ansaroudine de Linguère et contact.",
};

// Deux groupes plutôt qu'une liste unique : « lire » et « connaître le
// dahira » ne répondent pas à la même intention, et un menu de quatre
// entrées indifférenciées oblige à toutes les relire pour choisir.
const groups = [
  {
    title: "Lire et consulter",
    links: [
      {
        href: "/articles",
        label: "Articles",
        description: "Croyance, histoire, textes de zikr",
        icon: BookOpen,
      },
      {
        href: "/calendrier",
        label: "Calendrier",
        description: "Les prochains directs et causeries",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Le dahira",
    links: [
      {
        href: "/a-propos",
        label: "À propos",
        description: "Origine, mission et filiation",
        icon: Info,
      },
      {
        href: "/contact",
        label: "Contact",
        description: "Une question, une suggestion ?",
        icon: Mail,
      },
    ],
  },
];

export default function PlusPage() {
  return (
    <div>
      <PageHero
        eyebrow="Menu"
        title="Plus"
        subtitle="Le reste du site : articles, calendrier, présentation du dahira et contact."
        icon={MoreHorizontal}
        angle={155}
      />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-400">
              {group.title}
            </h2>

            <div className="mt-2 flex flex-col divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-card-bg">
              {group.links.map(({ href, label, description, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3.5 px-4 py-4 transition-colors active:bg-forest-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-forest-900">{label}</span>
                    {/* Pas de troncature : ces descriptions tiennent sur deux
                        lignes sur les écrans étroits plutôt que d'être coupées. */}
                    <span className="mt-0.5 block text-xs leading-snug text-forest-400">
                      {description}
                    </span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-forest-400" />
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* La chaîne YouTube est le seul lien sortant du site : elle est
            détachée des groupes internes pour que la sortie soit explicite. */}
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 rounded-2xl border border-border-subtle bg-forest-900 px-4 py-4"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">
            <MonitorPlay size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-white">Chaîne YouTube</span>
            <span className="mt-0.5 block text-xs leading-snug text-forest-100/60">
              Les directs et les enregistrements
            </span>
          </span>
          <ChevronRight size={17} className="shrink-0 text-forest-100/50" />
        </a>
      </div>
    </div>
  );
}
