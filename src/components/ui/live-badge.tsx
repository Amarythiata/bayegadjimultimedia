export function LiveBadge({ viewerCount }: { viewerCount?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-live-500 px-2.5 py-1 text-xs font-medium text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      EN DIRECT
      {/* `viewer_count` n'est alimenté par aucune source : tant qu'il vaut zéro,
          afficher « 0 spectateurs » sous un direct en cours dessert la page
          plus qu'il ne l'informe. */}
      {typeof viewerCount === "number" && viewerCount > 0 && (
        <span className="opacity-90">· {viewerCount.toLocaleString("fr-FR")} spectateurs</span>
      )}
    </span>
  );
}
