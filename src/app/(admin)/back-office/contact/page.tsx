import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { markAsRead, deleteMessage } from "./actions";

export default async function ContactBackOfficePage() {
  const supabase = await createClient();
  const profile = await getSessionProfile();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Messages de contact</h1>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {messages && messages.length > 0 ? (
          messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-2 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-forest-900">
                    {m.name}{" "}
                    {!m.is_read && (
                      <span className="ml-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-800">
                        Nouveau
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-forest-400">
                    {m.email} ·{" "}
                    {formatDistanceToNow(new Date(m.created_at), { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {!m.is_read && (
                    <form action={markAsRead.bind(null, m.id)}>
                      <button
                        type="submit"
                        className="text-xs text-forest-600 hover:text-forest-900"
                      >
                        Marquer comme lu
                      </button>
                    </form>
                  )}
                  {profile?.role === "administrateur" && (
                    <form action={deleteMessage.bind(null, m.id)}>
                      <button type="submit" className="text-xs text-live-600 hover:text-live-500">
                        Supprimer
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-line text-sm text-forest-800">{m.message}</p>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-sm text-forest-400">Aucun message reçu.</p>
        )}
      </div>
    </div>
  );
}
