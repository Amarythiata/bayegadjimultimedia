"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Video, Radio, Play, ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";
import type { MediaRow } from "@/lib/types/database";

const categoryLabels: Record<MediaRow["category"], string> = {
  gamou: "Gamou",
  causerie: "Causerie",
  cours: "Cours",
  conference: "Conférence",
  autre: "Autre",
};

export function MediaShowcase({ medias }: { medias: MediaRow[] }) {
  if (medias.length === 0) return null;

  return (
    <section className="bg-forest-50/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold-600">
              Médiathèque
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-forest-900 md:text-3xl">
              Revivez les moments forts
            </h2>
          </div>
          <Link
            href="/medias"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-forest-600 transition-colors hover:text-gold-600 md:flex"
          >
            Toute la médiathèque
            <ArrowRight size={15} />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {medias.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <Link href={`/medias/${m.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-forest-900 shadow-[0_10px_35px_-12px_rgba(13,26,8,0.4)] transition-shadow duration-500 group-hover:shadow-[0_18px_45px_-12px_rgba(13,26,8,0.55)]"
                >
                  {m.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- URL libre saisie par un admin
                    <img
                      src={m.cover_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,_rgba(217,154,43,0.25),transparent_55%),radial-gradient(circle_at_70%_80%,_rgba(74,107,65,0.5),transparent_55%)]">
                      {m.media_type === "video" ? (
                        <Video size={32} className="text-forest-100/30" />
                      ) : (
                        <Radio size={32} className="text-forest-100/30" />
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/95 via-forest-900/10 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/95 text-forest-900 shadow-lg">
                      <Play size={18} fill="currentColor" />
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gold-400">
                      {categoryLabels[m.category]}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-white">{m.title}</p>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
