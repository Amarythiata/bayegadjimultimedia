import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProseBody } from "@/components/ui/prose-body";
import { ShareButton } from "@/components/ui/share-button";

/**
 * Page de lecture d'un article ou d'une actualité.
 *
 * Les deux avaient un balisage identique : la refonte est appliquée une fois
 * ici plutôt que recopiée dans chaque route.
 */
export function EditorialPage({
  category,
  title,
  date,
  author,
  coverImageUrl,
  excerpt,
  body,
  backHref,
  backLabel,
}: {
  category: string;
  title: string;
  date: string | null;
  author?: string | null;
  coverImageUrl?: string | null;
  excerpt: string;
  body: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <article>
      {/* Bandeau sombre, comme les pages de liste : il porte le titre et
          détache la lecture du reste du site. La colonne est plus étroite que
          sur les listes — au-delà d'environ 75 caractères par ligne, l'œil
          perd le début de la ligne suivante. */}
      <header className="relative overflow-hidden bg-forest-900">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, #071912 0%, #0a2318 40%, #123726 78%, #1b4a37 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #d99a2b 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-forest-100/70 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            {backLabel}
          </Link>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-400">
            {category}
          </p>

          <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h1>

          <p className="mt-3 text-sm text-forest-100/60">
            {author && <span>Par {author}</span>}
            {author && date && <span> · </span>}
            {date && <span>{date}</span>}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-10">
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- URL libre saisie par un admin, pas de domaine fixe à autoriser
          <img
            src={coverImageUrl}
            alt=""
            className="mb-8 aspect-video w-full rounded-2xl object-cover"
          />
        )}

        {/* Chapô détaché du corps : c'est le résumé, pas le premier paragraphe. */}
        <p className="border-l-2 border-gold-400 pl-4 text-base leading-relaxed text-forest-900 md:text-lg">
          {excerpt}
        </p>

        <div className="mt-8">
          <ProseBody text={body} />
        </div>

        <div className="mt-10 border-t border-border-subtle pt-6">
          <ShareButton title={title} />
        </div>
      </div>
    </article>
  );
}
