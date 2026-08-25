import type { Metadata } from "next";
import { RadioHero } from "@/components/radio/radio-hero";
import { RadioConsole } from "@/components/radio/radio-console";
import { RadioInfo } from "@/components/radio/radio-info";

export const metadata: Metadata = {
  title: "Radio",
  description:
    "Écoutez la radio du dahira Ansaroudine de Linguère en direct, où que vous soyez dans le monde.",
};

export default function RadioPage() {
  return (
    // Fond sombre en pleine largeur : le reste du site est crème, cette page
    // impose son propre univers pour mettre le lecteur en avant.
    <div className="relative -mt-px min-h-screen bg-radio-950 text-radio-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, #10261a 0%, #0a1a11 45%, #06110a 100%)",
        }}
      />
      <div className="relative">
        <RadioHero />
        <RadioConsole />
        <RadioInfo />
      </div>
    </div>
  );
}
