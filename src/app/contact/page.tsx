"use client";

import { useActionState } from "react";
import { sendContactMessage } from "./actions";

export default function ContactPage() {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-12 md:py-20">
      <h1 className="text-xl font-medium text-forest-900">Contact</h1>
      <p className="mt-1 text-sm text-forest-400">
        Une question, une suggestion ? Écris-nous, on te répond rapidement.
      </p>

      {state?.ok ? (
        <p className="mt-6 rounded-lg bg-forest-100 px-3 py-2.5 text-sm text-forest-800">
          {state.message}
        </p>
      ) : (
        <form action={action} className="mt-6 flex flex-col gap-3">
          <label className="text-sm text-forest-800">
            Nom
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-forest-800">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm text-forest-800">
            Message
            <textarea
              name="message"
              required
              rows={5}
              maxLength={2000}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
            />
          </label>

          {state && !state.ok && <p className="text-sm text-live-600">{state.message}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Envoyer"}
          </button>
        </form>
      )}
    </div>
  );
}
