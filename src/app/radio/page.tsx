export default function RadioPage() {
  const streamUrl = process.env.NEXT_PUBLIC_RADIO_STREAM_URL;

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Radio</h1>
      <p className="mt-1 text-sm text-forest-400">
        Écoute la radio du dahira en direct, où que tu sois dans le monde.
      </p>

      <div className="mt-6 rounded-2xl bg-forest-900 p-6 text-white">
        {streamUrl ? (
          <audio controls className="w-full" src={streamUrl}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        ) : (
          <p className="py-4 text-center text-sm text-forest-100">
            Flux radio à configurer (URL Icecast / AzuraCast)
          </p>
        )}
      </div>

      <p className="mt-4 text-sm text-forest-400">
        La radio diffuse en continu via notre station en ligne — accessible depuis n&apos;importe
        quel pays, sans limite de portée contrairement à une FM classique.
      </p>
    </div>
  );
}
