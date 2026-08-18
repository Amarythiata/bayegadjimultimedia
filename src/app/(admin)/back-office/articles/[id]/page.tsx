import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../article-form";
import { updateArticle } from "../actions";

export default async function EditerArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase.from("articles").select("*").eq("id", id).single();

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Modifier l&apos;article</h1>
      <ArticleForm article={article} action={updateArticle.bind(null, id)} />
    </div>
  );
}
