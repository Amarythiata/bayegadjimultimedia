import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "../news-form";
import { updateNews } from "../actions";

export default async function EditerActualitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: news } = await supabase.from("news").select("*").eq("id", id).single();

  if (!news) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Modifier l&apos;actualité</h1>
      <NewsForm news={news} action={updateNews.bind(null, id)} />
    </div>
  );
}
