import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth";
import { articleCategoryLabels as categoryLabels } from "@/lib/article-categories";
import { deleteArticle } from "./actions";

export default async function ArticlesBackOfficePage() {
  const supabase = await createClient();
  const profile = await getSessionProfile();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-forest-900 md:text-xl">Articles</h1>
        <Link
          href="/back-office/articles/nouveau"
          className="flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-sm font-medium text-forest-900"
        >
          <Plus size={16} />
          Nouvel article
        </Link>
      </div>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {articles && articles.length > 0 ? (
          articles.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-forest-900">{a.title}</p>
                <p className="text-xs text-forest-400">
                  {categoryLabels[a.category] ?? a.category} ·{" "}
                  <span className={a.status === "publie" ? "text-forest-600" : "text-gold-600"}>
                    {a.status === "publie" ? "Publié" : "Brouillon"}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/back-office/articles/${a.id}`}
                  className="text-xs text-forest-600 hover:text-forest-900"
                >
                  Modifier
                </Link>
                {profile?.role === "administrateur" && (
                  <form action={deleteArticle.bind(null, a.id)}>
                    <button type="submit" className="text-xs text-live-600 hover:text-live-500">
                      Supprimer
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-sm text-forest-400">
            Aucun article pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
