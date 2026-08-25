"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Globe, ShieldCheck, Signal } from "lucide-react";
import { SoundWaves } from "./sound-waves";

const EASE = [0.16, 1, 0.3, 1] as const;

const badges = [
  { icon: Clock, label: "Écoute en direct 24h/24" },
  { icon: Globe, label: "Accessible partout" },
  { icon: ShieldCheck, label: "Sans publicité" },
  { icon: Signal, label: "Flux continu" },
];

/**
 * Photo de studio en fond, déjà floutée, assombrie et teintée en vert à la
 * fabrication plutôt qu'en CSS : le navigateur n'a aucun filtre à calculer,
 * et le fichier reste sous les 80 Ko.
 *
 * Le cadrage s'arrête au plan de travail. La partie haute de la photo
 * d'origine montre des portraits générés de figures religieuses, qui n'ont
 * pas leur place sur le site officiel du dahira.
 */
const BACKGROUND = "/radio/studio-console.jpg";

export function RadioHero() {
  // Sans ce garde-fou, le contenu naît à `opacity: 0` et ne devient visible
  // que si l'animation s'exécute. Un visiteur ayant demandé moins de
  // mouvement doit voir le texte immédiatement, pas un hero vide.
  const still = useReducedMotion();
  const rise = (delay: number) =>
    still
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-8 md:px-6 md:pt-16 md:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${BACKGROUND}')` }}
      />
      {/* Dégradé de lisibilité : opaque à gauche, où court le texte ; presque
          transparent à droite, pour laisser voir les micros et la console. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(95deg, rgba(6,17,10,.97) 0%, rgba(6,17,10,.94) 42%, rgba(6,17,10,.6) 68%, rgba(6,17,10,.42) 86%, rgba(6,17,10,.8) 100%)",
        }}
      />
      {/* Fondu vers le bas : le hero doit rejoindre le fond de page sans couture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, #06110a)" }}
      />

      <SoundWaves className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-70" />

      {/* Halo vert diffus, qui raccorde la photo au vert de la page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          {...rise(0)}
          className="inline-flex items-center gap-2 rounded-full border border-signal-400/30 bg-signal-400/10 px-3 py-1"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
          </span>
          <span className="text-xs font-medium tracking-wide text-signal-400">EN DIRECT</span>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl"
        >
          Radio <span className="text-signal-400">Ansaroudine de Linguère</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-3 max-w-lg text-sm leading-relaxed text-radio-400 md:text-base"
        >
          Écoutez la radio du dahira en direct, où que vous soyez dans le monde.
        </motion.p>

        <motion.ul
          {...rise(0.24)}
          className="mt-6 flex flex-wrap gap-2"
        >
          {badges.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-radio-line bg-white/5 px-3 py-1.5 text-xs text-radio-100 backdrop-blur-sm"
            >
              <Icon size={13} className="shrink-0 text-signal-400" />
              {label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
