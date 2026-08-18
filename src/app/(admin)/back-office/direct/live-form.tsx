"use client";

import { useActionState } from "react";
import type { LiveEventRow } from "@/lib/types/database";

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

function toDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function LiveForm({ live, action }: { live?: LiveEventRow; action: Action }) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-4 flex max-w-2xl flex-col gap-3">
      <label className="text-sm text-forest-800">
        Titre
        <input
          type="text"
          name="title"
          required
          defaultValue={live?.title}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Description (optionnel)
        <textarea
          name="description"
          rows={3}
          defaultValue={live?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1 text-sm text-forest-800">
          Type
          <select
            name="live_type"
            defaultValue={live?.live_type ?? "video"}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          >
            <option value="video">Vidéo (YouTube/Facebook Live)</option>
            <option value="radio">Radio (AzuraCast)</option>
          </select>
        </label>

        <label className="flex-1 text-sm text-forest-800">
          Statut
          <select
            name="status"
            defaultValue={live?.status ?? "a_venir"}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          >
            <option value="a_venir">À venir</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
          </select>
        </label>
      </div>

      <label className="text-sm text-forest-800">
        Date et heure de début
        <input
          type="datetime-local"
          name="scheduled_start"
          required
          defaultValue={toDatetimeLocal(live?.scheduled_start)}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        URL embed vidéo (YouTube/Facebook Live, optionnel)
        <input
          type="url"
          name="video_embed_url"
          defaultValue={live?.video_embed_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        URL flux radio (AzuraCast/Icecast, optionnel)
        <input
          type="url"
          name="radio_stream_url"
          defaultValue={live?.radio_stream_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      {error && <p className="text-sm text-live-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : live ? "Mettre à jour" : "Planifier le direct"}
      </button>
    </form>
  );
}
