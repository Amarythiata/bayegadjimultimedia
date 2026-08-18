export function LiveBadge({ viewerCount }: { viewerCount?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-live-500 px-2.5 py-1 text-xs font-medium text-white">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      EN DIRECT
      {typeof viewerCount === "number" && (
        <span className="opacity-90">· {viewerCount.toLocaleString("fr-FR")} spectateurs</span>
      )}
    </span>
  );
}
