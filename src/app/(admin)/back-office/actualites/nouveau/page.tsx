import { NewsForm } from "../news-form";
import { createNews } from "../actions";

export default function NouvelleActualitePage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Nouvelle actualité</h1>
      <NewsForm action={createNews} />
    </div>
  );
}
