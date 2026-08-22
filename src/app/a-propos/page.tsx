import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Le dahira Ansaroudine de Linguère : son origine, sa mission et la plateforme qui le prolonge en ligne.",
};

// Tout ce qui suit s'appuie sur l'historique recueilli par Cheikh Babacar Ba
// auprès de quatre témoins en juin 2010 (article « Historique du dahira »),
// complété par le dahira lui-même sur l'année de création. La seule section
// restée en attente est celle du guide spirituel actuel : aucune source
// disponible ne permet de l'écrire.

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">À propos</h1>
      <p className="mt-2 text-sm leading-relaxed text-forest-600">
        Le dahira Ansaroudine de Linguère réunit les talibés de Baye Gadji autour du zikr,
        de l&apos;enseignement et de l&apos;organisation du Gamou annuel.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-forest-900">Qui sommes-nous</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-800">
          Le dahira est né à Linguère, dans la région du Djolof, d&apos;une idée rapportée
          d&apos;un Gamou de Kaolack. La proposition émane d&apos;Adja Diama Niass, qui en
          devint la première présidente : réunir les femmes qui tenaient déjà des rencontres
          périodiques, et organiser à Linguère le Gamou que l&apos;on allait chercher
          ailleurs. Elle fut accueillie à l&apos;unanimité.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-forest-800">
          Le dahira est créé en 1960, et une trentaine de membres fondateurs, femmes et
          hommes, en sont nommément connus. Après quelques années de veille, les activités
          furent relancées avec le soutien de Baye Gadji lui-même.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-forest-800">
          Cette histoire n&apos;a longtemps existé qu&apos;à l&apos;oral. Elle a été recueillie
          en juin 2010 auprès de quatre témoins, puis mise par écrit par Cheikh Babacar Ba.
        </p>
        <Link
          href="/articles/historique-du-dahira-ansaroudine-de-linguere"
          className="mt-3 inline-block text-sm text-forest-600 underline underline-offset-4 hover:text-forest-900"
        >
          Lire l&apos;historique complet du dahira →
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-forest-900">Notre mission</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-800">
          Le Gamou reste le rendez-vous central du dahira, préparé collectivement lors des
          réunions qui le précèdent. Autour de lui vivent le zikr, les chants, les causeries
          en islam et l&apos;entraide entre talibés — une pratique transmise de génération en
          génération depuis les fondatrices.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-forest-800">
          Cette plateforme prolonge ce travail. Elle rassemble les actualités du dahira, les
          directs vidéo et la radio, une médiathèque d&apos;enregistrements, les textes de
          zikr et les articles. Elle s&apos;adresse d&apos;abord aux membres de Linguère, mais
          aussi à ceux que la distance éloigne : la radio est accessible depuis n&apos;importe
          où dans le monde.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-forest-900">Notre filiation</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-800">
          Les membres du dahira se rattachent à Baye Gadji, dont ils sollicitèrent
          l&apos;autorisation avant d&apos;organiser leur premier Gamou. Les textes récités au
          dahira inscrivent cette filiation dans la tariqa tidiane, et plusieurs d&apos;entre
          eux — dont la qasida <em>Fa madhou cheiykhi</em> — portent la signature de Baye
          Niass.
        </p>
        <Link
          href="/articles?categorie=zikr"
          className="mt-3 inline-block text-sm text-forest-600 underline underline-offset-4 hover:text-forest-900"
        >
          Consulter les textes de zikr →
        </Link>
      </section>

      {/* Une section « Notre guide spirituel » viendra ici dès que le dahira aura
          fourni le texte. Elle est absente plutôt que remplie d'un texte d'attente :
          mieux vaut une page complète mais plus courte qu'un espace réservé visible
          des visiteurs. */}

      <section className="mt-8 rounded-2xl border border-border-subtle bg-card-bg p-4">
        <h2 className="text-sm font-medium text-forest-900">Une précision, une correction ?</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-800">
          L&apos;auteur de l&apos;historique souhaitait que ce travail reste ouvert aux
          compléments : un nom oublié parmi les fondateurs, une date à préciser. Si vous
          détenez ces informations, écrivez-nous.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block text-sm text-forest-600 underline underline-offset-4 hover:text-forest-900"
        >
          Nous contacter →
        </Link>
      </section>
    </div>
  );
}
