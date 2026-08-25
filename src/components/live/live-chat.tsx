"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessageRow } from "@/lib/types/database";

const tones = {
  light: {
    header: "border-b border-border-subtle text-forest-900",
    empty: "text-forest-400",
    author: "text-forest-800",
    body: "text-forest-600",
    form: "border-t border-border-subtle",
    input: "border border-border-subtle bg-background",
  },
  dark: {
    header: "border-b border-white/10 text-white",
    empty: "text-forest-100/50",
    author: "text-white",
    body: "text-forest-100/80",
    form: "border-t border-white/10",
    input: "border border-white/10 bg-white/5 text-white placeholder:text-forest-100/40",
  },
};

/** `tone` adapte le chat au fond : la page /direct est sombre, le reste clair. */
export function LiveChat({
  liveEventId,
  disabled,
  tone = "light",
}: {
  liveEventId: string;
  disabled?: boolean;
  tone?: keyof typeof tones;
}) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || liveEventId === "mock") return;

    const supabase = createClient();

    supabase
      .from("chat_messages")
      .select("*")
      .eq("live_event_id", liveEventId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true })
      .then(({ data }) => data && setMessages(data));

    const channel = supabase
      .channel(`chat:${liveEventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `live_event_id=eq.${liveEventId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as ChatMessageRow]),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [liveEventId, disabled]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      alert("Connectez-vous pour participer au chat.");
      return;
    }

    await supabase.from("chat_messages").insert({
      live_event_id: liveEventId,
      author_id: userData.user.id,
      author_display_name: userData.user.user_metadata.full_name ?? "Auditeur",
      content: draft.trim(),
    });
    setDraft("");
  }

  const style = tones[tone];

  return (
    <div className="flex h-full flex-col">
      <p className={`p-3 text-sm font-medium ${style.header}`}>
        Chat en direct
      </p>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className={`text-xs ${style.empty}`}>
            {disabled
              ? "Le chat s'ouvre pendant le direct."
              : "Soyez le premier à poser une question."}
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className={`font-medium ${style.author}`}>{m.author_display_name}</span>{" "}
            <span className={style.body}>{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className={`flex gap-2 p-3 ${style.form}`}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Chat fermé" : "Votre question…"}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm disabled:opacity-50 ${style.input}`}
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-gold-400 p-2 text-forest-900 disabled:opacity-50"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
