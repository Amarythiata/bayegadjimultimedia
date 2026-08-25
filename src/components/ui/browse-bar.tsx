import Link from "next/link";
import { Search } from "lucide-react";

/**
 * Recherche et filtres par catégorie, partagés par Actualités et Médiathèque.
 *
 * Tout passe par des liens et un formulaire GET : les filtres restent dans
 * l'URL, donc partageables et indexables, et la page continue de fonctionner
 * sans JavaScript.
 */
export function BrowseBar({
  basePath,
  placeholder,
  categories,
  active,
  query,
  // Le calendrier filtre par état (à venir, passé) et non par catégorie :
  // le nom du paramètre doit refléter ce qu'il désigne dans l'URL.
  paramName = "categorie",
  allValue = "toutes",
}: {
  basePath: string;
  placeholder: string;
  categories: { value: string; label: string }[];
  active: string;
  query?: string;
  paramName?: string;
  allValue?: string;
}) {
  const href = (category: string) => {
    const search = new URLSearchParams();
    if (category !== allValue) search.set(paramName, category);
    if (query) search.set("q", query);
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="flex flex-col gap-3">
      <form action={basePath} className="relative">
        {active !== allValue && <input type="hidden" name={paramName} value={active} />}
        <Search
          size={16}
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-400"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-full border border-border-subtle bg-card-bg py-3 pl-11 pr-14 text-sm text-forest-900 placeholder:text-forest-400 focus:border-forest-400 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Rechercher"
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-forest-900 text-white transition-opacity hover:opacity-90"
        >
          <Search size={15} />
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <Link
            key={c.value}
            href={href(c.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              active === c.value
                ? "bg-forest-900 font-medium text-white"
                : "border border-border-subtle bg-card-bg text-forest-600 hover:border-forest-400"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
