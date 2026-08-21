"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { PlayCircle, PlaySquare, ChevronDown, Radio as RadioIcon } from "lucide-react";
import type { LiveEventRow } from "@/lib/types/database";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ live }: { live: LiveEventRow | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const isLive = live?.status === "en_cours";

  useEffect(() => {
    if (!videoRef.current) return;

    // React n'émet pas toujours l'attribut `muted` dans le HTML rendu, et iOS
    // refuse l'autoplay d'une vidéo qu'il ne considère pas muette. On le force
    // avant de tenter la lecture.
    videoRef.current.muted = true;
    // La lecture peut être refusée (mode économie d'énergie, préférence
    // système). L'affiche reste alors visible : c'est un repli acceptable.
    void videoRef.current.play().catch(() => {});

    const tween = gsap.fromTo(
      videoRef.current,
      { scale: 1 },
      {
        scale: 1.12,
        duration: 26,
        ease: "none",
        repeat: -1,
        yoyo: true,
      },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[78svh] items-center overflow-hidden bg-forest-900 md:min-h-[88svh]"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/hero-mosquee.jpg"
            // `src` directement sur l'élément plutôt qu'un <source> enfant :
            // Safari iOS déclenche l'autoplay plus fiablement ainsi.
            src="/hero-video-test.mp4"
            className="h-full w-full scale-100 object-cover"
            style={{ willChange: "transform" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-forest-900/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-900/55 to-forest-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-transparent to-forest-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(217,154,43,0.1),transparent_60%)]" />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-start px-4 py-24 md:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-forest-100/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-forest-100 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          Plateforme officielle du dahira Ansaroudine de Linguère
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.1 }}
          className="mt-6 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Vivez la spiritualité du dahira,
          <span className="text-gold-400"> où que vous soyez.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.22 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-forest-100/80 md:text-lg"
        >
          Directs vidéo et radio, actualités, médiathèque et articles — une seule plateforme
          pour rester connecté à la vie du dahira et de la tariqa, partout dans le monde.
        </motion.p>

        {isLive && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-live-500/15 px-4 py-2 text-sm text-live-500 ring-1 ring-inset ring-live-500/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live-500" />
            </span>
            En direct maintenant — {live.title}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.38 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/direct"
            className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-forest-900 shadow-[0_8px_30px_rgba(217,154,43,0.35)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(217,154,43,0.5)] hover:brightness-105 active:scale-[0.98]"
          >
            <PlayCircle size={18} className="transition-transform duration-300 group-hover:scale-110" />
            {isLive ? "Regarder le direct" : "Voir le direct"}
          </Link>

          <Link
            href="/radio"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/5 active:scale-[0.98]"
          >
            <RadioIcon size={16} className="transition-transform duration-300 group-hover:scale-110" />
            Écouter la radio
          </Link>

          <Link
            href="/medias"
            className="group inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-forest-100/70 transition-colors duration-300 hover:text-white"
          >
            <PlaySquare size={16} />
            Médiathèque
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-forest-100/50 md:flex"
      >
        <span className="text-[11px] tracking-wide">Découvrir</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </div>
  );
}
