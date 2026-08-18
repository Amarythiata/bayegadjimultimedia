import { LiveForm } from "../live-form";
import { createLiveEvent } from "../actions";

export default function NouveauDirectPage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Planifier un direct</h1>
      <LiveForm action={createLiveEvent} />
    </div>
  );
}
