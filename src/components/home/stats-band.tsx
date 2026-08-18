"use client";

import { Newspaper, BookOpen, PlaySquare, Radio } from "lucide-react";
import { Reveal } from "./reveal";
import { AnimatedCounter } from "./animated-counter";

export type HomeStats = {
  news: number;
  articles: number;
  medias: number;
  lives: number;
};

export function StatsBand({ stats }: { stats: HomeStats }) {
  const items = [
    { label: "Actualités publiées", value: stats.news, icon: Newspaper },
    { label: "Articles", value: stats.articles, icon: BookOpen },
    { label: "Contenus médiathèque", value: stats.medias, icon: PlaySquare },
    { label: "Directs organisés", value: stats.lives, icon: Radio },
  ];

  return (
    <section className="border-y border-border-subtle bg-card-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-border-subtle md:grid-cols-4">
        {items.map(({ label, value, icon: Icon }, i) => (
          <Reveal key={label} delay={i * 0.08} className="bg-card-bg px-6 py-10 text-center">
            <Icon size={20} className="mx-auto text-gold-600" />
            <p className="mt-3 text-3xl font-medium tabular-nums text-forest-900 md:text-4xl">
              <AnimatedCounter value={value} suffix="+" />
            </p>
            <p className="mt-1 text-xs text-forest-400 md:text-sm">{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
