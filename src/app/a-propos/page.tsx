import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Info, Landmark, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Le dahira Ansaroudine de Linguère : son origine, sa mission et la plateforme qui le prolonge en ligne.",
};

// Tout ce qui suit s'appuie sur l'historique recueilli par Cheikh Babacar Ba
// auprès de quatre témoins en juin 2010 (article « Historique du dahira »),
// complété par le dahira lui-même sur l'année de création. La section
// consacrée au guide spirituel reste absente tant que le dahira n'a pas
// fourni son texte : un intitulé vide vaut moins qu'une page plus courte.

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-card-bg p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
          <Icon size={17} />
        </span>
        <h2 className="text-base font-semibold text-forest-900">{title}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

const paragraph = "text-sm leading-relaxed text-forest-800 md:text-[15px]";
const inlineLink =
  "inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-900";

export default function AProposPage() {
  return (
    <div>
      <PageHero
        eyebrow="À propos"
        title="Le dahira Ansaroudine de Linguère"
        subtitle="Les talibés de Baye Gadji réunis autour du zikr, de l'enseignement et de l'organisation du Gamou annuel."
        icon={Landmark}
        angle={145}
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 md:px-6 md:py-10">
        <Section icon={Users} title="Qui sommes-nous">
          <p className={paragraph}>
            Le dahira est né à Linguère, dans la région du Djolof, d&apos;une idée rapportée
            d&apos;un Gamou de Kaolack. La proposition émane d&apos;Adja Diama Niass, qui en
            devint la première présidente : réunir les femmes qui tenaient déjà des rencontres
            périodiques, et organiser à Linguère le Gamou que l&apos;on allait chercher
            ailleurs. Elle fut accueillie à l&apos;unanimité.
          </p>
          <p className={paragraph}>
            Le dahira est créé en 1960, et une trentaine de membres fondateurs, femmes et
            hommes, en sont nommément connus. Après quelques années de veille, les activités
            furent relancées avec le soutien de Baye Gadji lui-même.
          </p>
          <p className={paragraph}>
            Cette histoire n&apos;a longtemps existé qu&apos;à l&apos;oral. Elle a été recueillie
            en juin 2010 auprès de quatre témoins, puis mise par écrit par Cheikh Babacar Ba.
          </p>
          <Link href="/articles/historique-du-dahira-ansaroudine-de-linguere" className={inlineLink}>
            Lire l&apos;historique complet du dahira
            <ArrowUpRight size={14} />
          </Link>
        </Section>

        <Section icon={BookOpen} title="Notre mission">
          <p className={paragraph}>
            Le Gamou reste le rendez-vous central du dahira, préparé collectivement lors des
            réunions qui le précèdent. Autour de lui vivent le zikr, les chants, les causeries
            en islam et l&apos;entraide entre talibés — une pratique transmise de génération en
            génération depuis les fondatrices.
          </p>
          <p className={paragraph}>
            Cette plateforme prolonge ce travail. Elle rassemble les actualités du dahira, les
            directs vidéo et la radio, une médiathèque d&apos;enregistrements, les textes de
            zikr et les articles. Elle s&apos;adresse d&apos;abord aux membres de Linguère, mais
            aussi à ceux que la distance éloigne : la radio est accessible depuis n&apos;importe
            où dans le monde.
          </p>
        </Section>

        <Section icon={Landmark} title="Notre filiation">
          <p className={paragraph}>
            Les membres du dahira se rattachent à Baye Gadji, dont ils sollicitèrent
            l&apos;autorisation avant d&apos;organiser leur premier Gamou. Les textes récités au
            dahira inscrivent cette filiation dans la tariqa tidiane, et plusieurs d&apos;entre
            eux — dont la qasida <em>Fa madhou cheiykhi</em> — portent la signature de Baye
            Niass.
          </p>
          <Link href="/articles?categorie=zikr" className={inlineLink}>
            Consulter les textes de zikr
            <ArrowUpRight size={14} />
          </Link>
        </Section>

        {/* Une section « Notre guide spirituel » viendra ici dès que le dahira
            aura fourni le texte. Elle est absente plutôt que remplie d'un texte
            d'attente : mieux vaut une page complète mais plus courte qu'un
            espace réservé visible des visiteurs. */}

        <section className="rounded-2xl border border-border-subtle bg-forest-900 p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">
              <Info size={17} />
            </span>
            <h2 className="text-base font-semibold text-white">Une précision, une correction ?</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-forest-100/70">
            L&apos;auteur de l&apos;historique souhaitait que ce travail reste ouvert aux
            compléments : un nom oublié parmi les fondateurs, une date à préciser. Si vous
            détenez ces informations, écrivez-nous.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-sm font-medium text-forest-900 transition-opacity hover:opacity-90"
          >
            Nous contacter
            <ArrowUpRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
