"use client";

import { useActionState } from "react";
import { Radio, Square } from "lucide-react";
import type { LiveStatus } from "@/lib/types/database";

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

/**
 * Bouton unique qui ouvre puis clôt un direct.
 *
 * Le statut était auparavant enfoui dans un menu du formulaire d'édition, ce
 * qui obligeait à ouvrir la fiche, changer un champ et enregistrer — au moment
 * précis où l'on a le moins de temps disponible.
 */
export function LiveStatusButton({
  status,
  goLive,
  endLive,
}: {
  status: LiveStatus;
  goLive: Action;
  endLive: Action;
}) {
  const isLive = status === "en_cours";
  const [error, formAction, pending] = useActionState(isLive ? endLive : goLive, undefined);

  // Un direct terminé se rouvre depuis le formulaire : le proposer ici
  // exposerait surtout au clic accidentel sur d'anciennes sessions.
  if (status === "termine") return null;

  return (
    <form action={formAction} className="shrink-0">
      <button
        type="submit"
        disabled={pending}
        onClick={(e) => {
          // Le passage en direct est immédiatement visible de tous les
          // visiteurs : mieux vaut une confirmation qu'un direct annoncé à tort.
          if (!isLive && !window.confirm("Annoncer ce direct comme commencé sur le site ?")) {
            e.preventDefault();
          }
        }}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50 ${
          isLive
            ? "border border-border-subtle text-forest-600 hover:text-forest-900"
            : "bg-live-600 text-white"
        }`}
      >
        {isLive ? <Square size={13} /> : <Radio size={13} />}
        {pending ? "…" : isLive ? "Terminer" : "Passer en direct"}
      </button>
      {error && <p className="mt-1 text-right text-xs text-live-600">{error}</p>}
    </form>
  );
}
