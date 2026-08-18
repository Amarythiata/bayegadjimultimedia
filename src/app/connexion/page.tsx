"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "./actions";

export default function ConnexionPage() {
  const [error, action, pending] = useActionState(signIn, undefined);

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-12 md:py-20">
      <h1 className="text-xl font-medium text-forest-900">Connexion back-office</h1>
      <p className="mt-1 text-sm text-forest-400">
        Réservé aux modérateurs et administrateurs du dahira.
      </p>

      <form action={action} className="mt-6 flex flex-col gap-3">
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
          Mot de passe
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
          />
        </label>

        {error && <p className="text-sm text-live-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <Link
        href="/mot-de-passe-oublie"
        className="mt-4 text-sm text-forest-600 hover:text-forest-900"
      >
        Mot de passe oublié ?
      </Link>
    </div>
  );
}
