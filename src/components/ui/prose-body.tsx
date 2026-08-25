/**
 * Rendu du corps d'un texte saisi au back-office.
 *
 * Le champ est du texte brut : ni Markdown, ni éditeur riche. Les paragraphes
 * sont séparés par une ligne vide, et les retours à la ligne internes sont
 * conservés — indispensable pour les qasidas, dont la versification porte le
 * sens.
 *
 * Seuls les intertitres tout en capitales sont reconnus comme tels. La
 * tentation serait d'en détecter davantage, mais toute autre règle se
 * retournerait contre les textes de zikr, où chaque vers est une ligne courte
 * sans ponctuation finale : ils deviendraient une suite de titres.
 */
function isHeading(block: string): boolean {
  if (block.includes("\n") || block.length > 70) return false;
  if (!/[A-ZÀ-Þ]/.test(block)) return false;
  return block === block.toUpperCase();
}

export function ProseBody({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) =>
        isHeading(block) ? (
          <h2
            key={i}
            className="mt-6 border-b border-border-subtle pb-2 text-sm font-semibold uppercase tracking-wide text-forest-900 first:mt-0"
          >
            {block}
          </h2>
        ) : (
          <p
            key={i}
            className="whitespace-pre-line text-[15px] leading-[1.75] text-forest-800 md:text-base"
          >
            {block}
          </p>
        ),
      )}
    </div>
  );
}
