"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });

    // Toujours le même message, qu'un compte existe ou non pour cet email
    // (évite de laisser deviner quelles adresses sont enregistrées).
    setPending(false);
    setSent(true);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-12 md:py-20">
      <h1 className="text-xl font-medium text-forest-900">Mot de passe oublié</h1>
      <p className="mt-1 text-sm text-forest-400">
        Renseigne ton email, on t&apos;envoie un lien pour en choisir un nouveau.
      </p>

      {sent ? (
        <p className="mt-6 rounded-lg bg-forest-100 px-3 py-2.5 text-sm text-forest-800">
          Si un compte existe pour cette adresse, un email vient d&apos;être envoyé avec un lien
          de réinitialisation.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <label className="text-sm text-forest-800">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-card-bg px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
      )}

      <Link href="/connexion" className="mt-4 text-sm text-forest-600 hover:text-forest-900">
        ← Retour à la connexion
      </Link>
    </div>
  );
}
