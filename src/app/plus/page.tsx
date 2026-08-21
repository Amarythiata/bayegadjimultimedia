import Link from "next/link";
import { BookOpen, CalendarDays, Info, Mail, ChevronRight } from "lucide-react";

const links = [
  { href: "/articles", label: "Articles", description: "Textes sur l'islam en général", icon: BookOpen },
  { href: "/calendrier", label: "Calendrier", description: "Les prochains directs et causeries", icon: CalendarDays },
  { href: "/a-propos", label: "À propos", description: "Le dahira Ansaroudine Linguère", icon: Info },
  { href: "/contact", label: "Contact", description: "Une question, une suggestion ?", icon: Mail },
];

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-4 md:px-6 md:py-8">
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Plus</h1>

      <div className="mt-4 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {links.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-forest-900">{label}</p>
              <p className="truncate text-xs text-forest-400">{description}</p>
            </div>
            <ChevronRight size={16} className="shrink-0 text-forest-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
