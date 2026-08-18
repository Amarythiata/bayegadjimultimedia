import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LiveForm } from "../live-form";
import { updateLiveEvent } from "../actions";

export default async function EditerDirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: live } = await supabase.from("live_events").select("*").eq("id", id).single();

  if (!live) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Modifier le direct</h1>
      <LiveForm live={live} action={updateLiveEvent.bind(null, id)} />
    </div>
  );
}
