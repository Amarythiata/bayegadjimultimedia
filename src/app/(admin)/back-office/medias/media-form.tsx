"use client";

import { useActionState } from "react";
import type { MediaRow } from "@/lib/types/database";

const categories: { value: MediaRow["category"]; label: string }[] = [
  { value: "gamou", label: "Gamou" },
  { value: "causerie", label: "Causerie" },
  { value: "cours", label: "Cours" },
  { value: "conference", label: "Conférence" },
  { value: "autre", label: "Autre" },
];

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

export function MediaForm({ media, action }: { media?: MediaRow; action: Action }) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-4 flex max-w-2xl flex-col gap-3">
      <label className="text-sm text-forest-800">
        Titre
        <input
          type="text"
          name="title"
          required
          defaultValue={media?.title}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Slug (laisser vide pour générer automatiquement)
        <input
          type="text"
          name="slug"
          defaultValue={media?.slug}
          placeholder="genere-depuis-le-titre"
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Description
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={media?.description}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1 text-sm text-forest-800">
          Type
          <select
            name="media_type"
            defaultValue={media?.media_type ?? "video"}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          >
            <option value="video">Vidéo (YouTube/Facebook)</option>
            <option value="radio">Audio (fichier)</option>
          </select>
        </label>

        <label className="flex-1 text-sm text-forest-800">
          Catégorie
          <select
            name="category"
            required
            defaultValue={media?.category ?? ""}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="text-sm text-forest-800">
        URL du média (embed vidéo ou fichier audio)
        <input
          type="url"
          name="media_url"
          required
          defaultValue={media?.media_url}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Image de couverture (URL, optionnel)
        <input
          type="url"
          name="cover_image_url"
          defaultValue={media?.cover_image_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Statut
        <select
          name="status"
          defaultValue={media?.status ?? "brouillon"}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        >
          <option value="brouillon">Brouillon</option>
          <option value="publie">Publié</option>
        </select>
      </label>

      {error && <p className="text-sm text-live-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : media ? "Mettre à jour" : "Ajouter le média"}
      </button>
    </form>
  );
}
