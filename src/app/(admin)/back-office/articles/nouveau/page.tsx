import { ArticleForm } from "../article-form";
import { createArticle } from "../actions";

export default function NouvelArticlePage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Nouvel article</h1>
      <ArticleForm action={createArticle} />
    </div>
  );
}
