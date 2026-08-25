import type { LucideIcon } from "lucide-react";

/**
 * Bandeau d'en-tête commun aux pages Direct, Actualités et Médiathèque.
 *
 * Le fond est dessiné plutôt que photographié : trois photos de banque
 * d'images auraient introduit un univers visuel étranger au dahira, et
 * plusieurs centaines de kilo-octets. Les dégradés reprennent le vert forêt
 * et l'or du site, et l'icône en filigrane suffit à distinguer les pages.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  angle = 115,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  /** Décale l'orientation du dégradé pour que les trois pages diffèrent. */
  angle?: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-b-3xl bg-forest-900">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${angle}deg, #071912 0%, #0a2318 38%, #123726 72%, #1b4a37 100%)`,
        }}
      />
      {/* Halo doré : rappelle l'accent du site et évite l'aplat uniforme. */}
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #d99a2b 0%, transparent 70%)" }}
      />

      {/* Icône en filigrane, à la place de la photo. */}
      <Icon
        aria-hidden
        className="pointer-events-none absolute -bottom-8 right-4 h-48 w-48 text-white/[0.06] md:right-16 md:h-64 md:w-64"
        strokeWidth={1}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-100/70 md:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
