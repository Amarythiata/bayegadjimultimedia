"use client";

import { useActionState } from "react";
import type { NewsRow } from "@/lib/types/database";

const categories: { value: NewsRow["category"]; label: string }[] = [
  { value: "annonces", label: "Annonces" },
  { value: "evenements", label: "Événements" },
  { value: "communiques", label: "Communiqués" },
  { value: "vie_du_dahira", label: "Vie du dahira" },
];

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

export function NewsForm({ news, action }: { news?: NewsRow; action: Action }) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-4 flex max-w-2xl flex-col gap-3">
      <label className="text-sm text-forest-800">
        Titre
        <input
          type="text"
          name="title"
          required
          defaultValue={news?.title}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Slug (laisser vide pour générer automatiquement)
        <input
          type="text"
          name="slug"
          defaultValue={news?.slug}
          placeholder="genere-depuis-le-titre"
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Chapô (résumé court)
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={news?.excerpt}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Contenu
        <textarea
          name="body"
          required
          rows={8}
          defaultValue={news?.body}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Image de couverture (URL, optionnel)
        <input
          type="url"
          name="cover_image_url"
          defaultValue={news?.cover_image_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1 text-sm text-forest-800">
          Catégorie
          <select
            name="category"
            required
            defaultValue={news?.category ?? ""}
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

        <label className="flex-1 text-sm text-forest-800">
          Statut
          <select
            name="status"
            defaultValue={news?.status ?? "brouillon"}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          >
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-live-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
      >
        {pending ? "Enregistrement…" : news ? "Mettre à jour" : "Créer l'actualité"}
      </button>
    </form>
  );
}
