"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Headphones, Newspaper, Image as ImageIcon, MoreHorizontal } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/direct", label: "Direct", icon: Radio },
  { href: "/radio", label: "Radio", icon: Headphones },
  { href: "/actualites", label: "Actualités", icon: Newspaper },
  { href: "/medias", label: "Médias", icon: ImageIcon },
  { href: "/plus", label: "Plus", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-border-subtle bg-card-bg/95 backdrop-blur md:hidden"
      aria-label="Navigation principale"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
              active ? "text-forest-800" : "text-forest-400"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
