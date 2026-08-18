"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessageRow } from "@/lib/types/database";

export function LiveChat({
  liveEventId,
  disabled,
}: {
  liveEventId: string;
  disabled?: boolean;
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

  return (
    <div className="flex h-full flex-col">
      <p className="border-b border-border-subtle p-3 text-sm font-medium text-forest-900">
        Chat en direct
      </p>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-xs text-forest-400">
            {disabled
              ? "Le chat s'ouvre pendant le direct."
              : "Soyez le premier à poser une question."}
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-medium text-forest-800">{m.author_display_name}</span>{" "}
            <span className="text-forest-600">{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-border-subtle p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Chat fermé" : "Votre question…"}
          className="flex-1 rounded-full border border-border-subtle bg-background px-3 py-1.5 text-sm disabled:opacity-50"
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
