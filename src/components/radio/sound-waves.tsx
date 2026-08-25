"use client";

import { useEffect, useRef } from "react";

/**
 * Ondes sonores ambiantes dessinées en canvas, derrière le contenu.
 *
 * Remplace la photo de studio de la maquette : rien à charger, aucun poids
 * réseau, et le motif s'adapte à toutes les tailles d'écran. Purement
 * décoratif — il n'analyse pas le flux audio.
 *
 * L'animation s'arrête si le visiteur a demandé moins de mouvement, et
 * lorsque l'onglet passe en arrière-plan : une boucle de rendu invisible ne
 * ferait que consommer de la batterie.
 */
export function SoundWaves({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;

    // Trois ondes de fréquences et d'amplitudes différentes : leur
    // superposition évite le motif répétitif d'une sinusoïde unique.
    const layers = [
      { amp: 26, freq: 0.0055, speed: 0.014, alpha: 0.5, width: 1.5, y: 0.42 },
      { amp: 38, freq: 0.0032, speed: 0.009, alpha: 0.3, width: 1.2, y: 0.55 },
      { amp: 18, freq: 0.0082, speed: 0.02, alpha: 0.2, width: 1, y: 0.68 },
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const layer of layers) {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0)");
        gradient.addColorStop(0.5, `rgba(34, 197, 94, ${layer.alpha})`);
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = layer.width;

        for (let x = 0; x <= width; x += 3) {
          const phase = frame * layer.speed;
          // Une seconde sinusoïde très lente module l'amplitude, ce qui donne
          // le gonflement irrégulier d'un vrai signal plutôt qu'un ruban plat.
          const swell = 0.65 + 0.35 * Math.sin(x * 0.0015 + phase * 0.6);
          const y =
            height * layer.y + Math.sin(x * layer.freq + phase) * layer.amp * swell;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      frame += 1;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduced) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      draw();
    };

    resize();
    draw();
    start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
