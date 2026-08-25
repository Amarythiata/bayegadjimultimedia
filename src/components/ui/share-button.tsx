"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

const tones = {
  light: {
    label: "text-sm text-forest-400",
    button:
      "inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3.5 py-1.5 text-sm text-forest-600 transition-colors hover:border-forest-400 hover:text-forest-900",
  },
  dark: {
    label: "text-sm text-radio-400",
    button:
      "inline-flex items-center gap-1.5 rounded-full border border-radio-line bg-white/5 px-3.5 py-1.5 text-sm text-radio-100 transition-colors hover:border-signal-400/50 hover:text-white",
  },
};

/**
 * Rangée de partage : WhatsApp d'abord, canal dominant pour la diaspora,
 * puis Facebook et la copie du lien.
 *
 * Les liens sont construits au clic plutôt qu'au rendu : l'URL courante n'est
 * connue que côté navigateur, et la coder en dur romprait au moindre
 * changement de domaine.
 *
 * `tone` adapte les couleurs au fond : la page /radio est sombre, le reste du
 * site est clair. Deux composants séparés auraient dupliqué la logique de
 * partage pour une simple question de palette.
 */
export function ShareButton({
  title,
  tone = "light",
}: {
  title: string;
  tone?: keyof typeof tones;
}) {
  const style = tones[tone];
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const openShare = (build: (url: string) => string) => {
    const target = build(window.location.href);
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Presse-papiers indisponible : on ne prétend pas avoir copié.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={style.label}>Partager :</span>

      <button
        type="button"
        onClick={() =>
          openShare(
            (url) => `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
          )
        }
        className={style.button}
      >
        WhatsApp
      </button>

      <button
        type="button"
        onClick={() =>
          openShare(
            (url) =>
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          )
        }
        className={style.button}
      >
        Facebook
      </button>

      <button
        type="button"
        onClick={() =>
          openShare(
            (url) =>
              `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          )
        }
        className={style.button}
      >
        Telegram
      </button>

      <button
        type="button"
        onClick={copyLink}
        aria-label={`Copier le lien : ${title}`}
        className={style.button}
      >
        {copied ? (
          <>
            <Check size={14} />
            Lien copié
          </>
        ) : (
          <>
            <LinkIcon size={14} />
            Copier le lien
          </>
        )}
      </button>
    </div>
  );
}
