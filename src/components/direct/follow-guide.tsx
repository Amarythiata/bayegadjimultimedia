import { Bell, MonitorPlay, PlaySquare, Radio } from "lucide-react";

const steps = [
  {
    icon: Bell,
    title: "Sur cette page",
    text: "Le lecteur s'affiche dès le début de la retransmission. Aucune inscription n'est nécessaire.",
  },
  {
    icon: Radio,
    title: "En radio",
    text: "La radio diffuse en continu, y compris pendant les directs. Elle consomme beaucoup moins de données que la vidéo.",
  },
  {
    icon: MonitorPlay,
    title: "Sur YouTube",
    text: "Les directs sont aussi retransmis sur la chaîne officielle, où vous pouvez activer les notifications.",
  },
  {
    icon: PlaySquare,
    title: "En différé",
    text: "Les enregistrements des sessions passées restent disponibles dans la médiathèque.",
  },
];

/** Toujours visible, quel que soit l'état du direct : c'est la question que
 *  se pose un visiteur qui arrive et ne trouve pas de retransmission. */
export function FollowGuide() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <h2 className="text-sm font-semibold text-white">Comment suivre nos directs</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {steps.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-400">
              <Icon size={15} />
            </span>
            <div>
              <p className="text-sm text-white">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-forest-100/60">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
