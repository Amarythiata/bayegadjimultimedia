import { Bell, MonitorPlay, PlaySquare, Radio } from "lucide-react";

const steps = [
  {
    icon: Bell,
    title: "Sur cette page",
    text: "Le lecteur s'affiche automatiquement dès le début de la retransmission. Aucune inscription requise.",
  },
  {
    icon: Radio,
    title: "En radio",
    text: "La radio du dahira diffuse en continu, y compris pendant les directs. Elle consomme moins de données que la vidéo.",
  },
  {
    icon: MonitorPlay,
    title: "Sur YouTube",
    text: "Les directs sont également retransmis sur notre chaîne officielle. Activez les notifications pour ne rien manquer.",
  },
  {
    icon: PlaySquare,
    title: "En différé",
    text: "Les enregistrements des sessions passées sont disponibles dans la médiathèque.",
  },
];

/** Toujours visible, quel que soit l'état du direct : c'est la question que
 *  se pose un visiteur qui arrive et ne trouve pas de retransmission. */
export function FollowGuide() {
  return (
    <section>
      <h2 className="text-base font-semibold text-forest-900">Comment suivre nos directs</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="relative overflow-hidden rounded-2xl border border-border-subtle bg-card-bg p-5"
          >
            <span
              aria-hidden
              className="absolute right-4 top-3 text-2xl font-semibold tabular-nums text-forest-100"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
              <Icon size={17} />
            </span>
            <p className="mt-3 text-sm font-semibold text-forest-900">{title}</p>
            <p className="mt-1 pr-8 text-xs leading-relaxed text-forest-400">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
