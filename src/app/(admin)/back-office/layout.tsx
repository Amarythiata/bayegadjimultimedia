import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Newspaper, BookOpen, Radio, PlaySquare, Mail, LogOut } from "lucide-react";
import { getSessionProfile, canAccessBackOffice } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const navItems = [
  { href: "/back-office", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/back-office/actualites", label: "Actualités", icon: Newspaper },
  { href: "/back-office/articles", label: "Articles", icon: BookOpen },
  { href: "/back-office/medias", label: "Médiathèque", icon: PlaySquare },
  { href: "/back-office/direct", label: "Direct", icon: Radio },
  { href: "/back-office/contact", label: "Contact", icon: Mail },
];

export default async function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/connexion");
  }
  if (!canAccessBackOffice(profile.role)) {
    redirect("/");
  }

  const supabase = await createClient();
  const { count: unreadCount } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    // Pas de conteneur centré ici : la barre latérale doit toucher le bord
    // gauche de l'écran. C'est le contenu seul qui est borné en largeur.
    <div className="flex flex-col md:min-h-[calc(100vh-3.5rem)] md:flex-row">
      <aside className="flex shrink-0 flex-col justify-between border-b border-forest-900/40 bg-forest-800 px-3 py-4 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-60 md:border-b-0 md:border-r md:px-4 md:py-6">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-forest-100 transition-colors hover:bg-forest-600/50"
            >
              <Icon size={17} />
              {label}
              {href === "/back-office/contact" && Boolean(unreadCount) && (
                <span className="rounded-full bg-gold-400 px-1.5 py-0.5 text-[10px] font-medium text-forest-900">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-4 hidden border-t border-forest-600/40 pt-4 md:block">
          <p className="truncate text-sm text-forest-100">{profile.full_name ?? "Sans nom"}</p>
          <p className="text-xs capitalize text-forest-400">{profile.role}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 flex items-center gap-2 text-xs text-forest-100 transition-colors hover:text-gold-100"
            >
              <LogOut size={14} />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-4 md:px-8 md:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
