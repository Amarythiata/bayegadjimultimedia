import { MediaForm } from "../media-form";
import { createMedia } from "../actions";

export default function NouveauMediaPage() {
  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Ajouter un média</h1>
      <MediaForm action={createMedia} />
    </div>
  );
}
