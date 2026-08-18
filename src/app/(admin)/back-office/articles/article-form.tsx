"use client";

import { useActionState } from "react";
import type { ArticleRow } from "@/lib/types/database";

const categories: { value: ArticleRow["category"]; label: string }[] = [
  { value: "croyance", label: "Croyance" },
  { value: "jurisprudence", label: "Jurisprudence" },
  { value: "spiritualite", label: "Spiritualité" },
  { value: "histoire", label: "Histoire" },
  { value: "biographie", label: "Biographie" },
  { value: "enseignements", label: "Enseignements" },
];

type Action = (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;

export function ArticleForm({ article, action }: { article?: ArticleRow; action: Action }) {
  const [error, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-4 flex max-w-2xl flex-col gap-3">
      <label className="text-sm text-forest-800">
        Titre
        <input
          type="text"
          name="title"
          required
          defaultValue={article?.title}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Slug (laisser vide pour générer automatiquement)
        <input
          type="text"
          name="slug"
          defaultValue={article?.slug}
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
          defaultValue={article?.excerpt}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Contenu
        <textarea
          name="body"
          required
          rows={8}
          defaultValue={article?.body}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-forest-800">
        Image de couverture (URL, optionnel)
        <input
          type="url"
          name="cover_image_url"
          defaultValue={article?.cover_image_url ?? ""}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex-1 text-sm text-forest-800">
          Catégorie
          <select
            name="category"
            required
            defaultValue={article?.category ?? ""}
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
            defaultValue={article?.status ?? "brouillon"}
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
        {pending ? "Enregistrement…" : article ? "Mettre à jour" : "Créer l'article"}
      </button>
    </form>
  );
}
