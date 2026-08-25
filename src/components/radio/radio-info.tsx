import Link from "next/link";
import { ArrowUpRight, Globe, MonitorPlay, Share2, Smartphone } from "lucide-react";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

const listen = [
  {
    icon: Globe,
    title: "Depuis un navigateur",
    text: "Directement sur cette page, sans rien installer.",
  },
  {
    icon: Smartphone,
    title: "Sur téléphone",
    text: "La radio consomme peu de données : elle passe là où la vidéo échoue.",
  },
  {
    icon: Share2,
    title: "En la partageant",
    text: "Un lien suffit pour que vos proches écoutent, où qu'ils vivent.",
  },
];

/**
 * Trois colonnes de bas de page.
 *
 * Aucun réseau social n'est listé tant que les comptes officiels ne sont pas
 * confirmés : un lien mort vaut moins que pas de lien. Seule la chaîne
 * YouTube, déjà utilisée pour les directs, est certaine.
 */
export function RadioInfo() {
  return (
    <section className="px-4 pb-16 md:px-6">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-radio-line bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white">À propos de la radio</h2>
          <p className="mt-2 text-sm leading-relaxed text-radio-400">
            La radio du dahira diffuse en continu : enregistrements de Gamou, causeries et
            zikr. Contrairement à une FM, sa portée n&apos;a pas de limite géographique —
            elle s&apos;écoute depuis n&apos;importe quel pays.
          </p>
          <Link
            href="/a-propos"
            className="mt-4 inline-flex items-center gap-1 text-sm text-signal-400 hover:underline"
          >
            En savoir plus <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="rounded-2xl border border-radio-line bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white">Nous écouter partout</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {listen.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <Icon size={15} className="mt-0.5 shrink-0 text-signal-400" />
                <div>
                  <p className="text-sm text-radio-100">{title}</p>
                  <p className="text-xs leading-relaxed text-radio-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-radio-line bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-white">Aller plus loin</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-xl border border-radio-line px-3 py-2.5 text-sm text-radio-100 transition-colors hover:border-signal-400/50 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <MonitorPlay size={15} className="text-signal-400" />
                Chaîne YouTube
              </span>
              <ArrowUpRight size={14} className="shrink-0 text-radio-400" />
            </a>

            <Link
              href="/direct"
              className="flex items-center justify-between gap-2 rounded-xl border border-radio-line px-3 py-2.5 text-sm text-radio-100 transition-colors hover:border-signal-400/50 hover:text-white"
            >
              <span>Les directs du dahira</span>
              <ArrowUpRight size={14} className="shrink-0 text-radio-400" />
            </Link>

            <Link
              href="/medias"
              className="flex items-center justify-between gap-2 rounded-xl border border-radio-line px-3 py-2.5 text-sm text-radio-100 transition-colors hover:border-signal-400/50 hover:text-white"
            >
              <span>Médiathèque</span>
              <ArrowUpRight size={14} className="shrink-0 text-radio-400" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center justify-between gap-2 rounded-xl border border-radio-line px-3 py-2.5 text-sm text-radio-100 transition-colors hover:border-signal-400/50 hover:text-white"
            >
              <span>Nous contacter</span>
              <ArrowUpRight size={14} className="shrink-0 text-radio-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
