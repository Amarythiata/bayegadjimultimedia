import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/direct", label: "Direct" },
  { href: "/radio", label: "Radio" },
  { href: "/actualites", label: "Actualités" },
  { href: "/articles", label: "Articles" },
  { href: "/medias", label: "Médiathèque" },
  { href: "/a-propos", label: "À propos" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/contact", label: "Contact" },
];

export function TopNav() {
  return (
    <header className="hidden border-b border-forest-900/40 bg-forest-800 md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-gold-100">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-gold-400 text-xs font-semibold text-forest-900">
            BG
          </span>
          <span className="font-medium">Bayegadji Multimédia</span>
        </Link>
        <nav className="flex gap-6 text-sm text-forest-100">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold-100">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
