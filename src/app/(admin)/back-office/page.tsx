import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Newspaper, FileEdit, Radio, BookOpen, PlaySquare, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RadioAudience } from "@/components/back-office/radio-audience";
import { formatEventDateTime } from "@/lib/dates";

type ActivityItem = {
  id: string;
  kind: "actualite" | "article" | "media" | "direct";
  label: string;
  title: string;
  authorName: string;
  createdAt: string;
  href: string;
};

async function getDashboardData() {
  const supabase = await createClient();

  const [
    { data: stats },
    { count: articlesCount },
    { count: mediasCount },
    { count: unreadMessages },
    { data: nextLive },
    { data: recentNews },
    { data: recentArticles },
    { data: recentMedias },
    { data: recentLive },
  ] = await Promise.all([
    supabase.from("dashboard_stats").select("*").single(),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "publie"),
    supabase.from("medias").select("id", { count: "exact", head: true }).eq("status", "publie"),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("live_events")
      .select("title, scheduled_start")
      .eq("status", "a_venir")
      .order("scheduled_start", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("news")
      .select("id, title, status, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("articles")
      .select("id, title, status, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("medias")
      .select("id, title, status, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("live_events")
      .select("id, title, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const activity: ActivityItem[] = [
    ...(recentNews ?? []).map((n) => ({
      id: n.id,
      kind: "actualite" as const,
      label: n.status === "publie" ? "Actualité publiée" : "Actualité en brouillon",
      title: n.title,
      authorName: n.profiles?.full_name ?? "Quelqu'un",
      createdAt: n.created_at,
      href: `/back-office/actualites/${n.id}`,
    })),
    ...(recentArticles ?? []).map((a) => ({
      id: a.id,
      kind: "article" as const,
      label: a.status === "publie" ? "Article publié" : "Article en brouillon",
      title: a.title,
      authorName: a.profiles?.full_name ?? "Quelqu'un",
      createdAt: a.created_at,
      href: `/back-office/articles/${a.id}`,
    })),
    ...(recentMedias ?? []).map((m) => ({
      id: m.id,
      kind: "media" as const,
      label: m.status === "publie" ? "Média publié" : "Média en brouillon",
      title: m.title,
      authorName: m.profiles?.full_name ?? "Quelqu'un",
      createdAt: m.created_at,
      href: `/back-office/medias/${m.id}`,
    })),
    ...(recentLive ?? []).map((l) => ({
      id: l.id,
      kind: "direct" as const,
      label: "Direct planifié",
      title: l.title,
      authorName: l.profiles?.full_name ?? "Quelqu'un",
      createdAt: l.created_at,
      href: `/back-office/direct/${l.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return {
    stats: stats ?? { actualites_publiees: 0, actualites_brouillon: 0, direct_en_cours: false },
    articlesCount: articlesCount ?? 0,
    mediasCount: mediasCount ?? 0,
    unreadMessages: unreadMessages ?? 0,
    nextLive,
    activity,
  };
}

/** Indicateur simple, optionnellement cliquable vers la section concernée. */
function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  href,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  accent?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center gap-2 text-forest-400">
        <Icon size={16} className={accent ? "text-gold-600" : undefined} />
        <p className="text-xs">{label}</p>
      </div>
      <p
        className={`mt-2 text-2xl font-semibold tabular-nums ${
          accent ? "text-gold-600" : "text-forest-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 truncate text-xs text-forest-400">{hint}</p>}
    </>
  );

  const className = `rounded-2xl border border-border-subtle bg-card-bg p-4${
    href ? " transition-colors hover:border-forest-400" : ""
  }`;

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export default async function BackOfficeDashboardPage() {
  const { stats, articlesCount, mediasCount, unreadMessages, nextLive, activity } =
    await getDashboardData();

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Tableau de bord</h1>

      {/* Audience d'abord : c'est la seule mesure d'impact réel, le reste
          décrit surtout le volume produit. */}
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <RadioAudience />

        <Kpi
          icon={Radio}
          label="Direct"
          value={stats.direct_en_cours ? "En cours" : "Aucun"}
          hint={
            nextLive
              ? `Prochain : ${formatEventDateTime(nextLive.scheduled_start)}`
              : "Aucune session programmée"
          }
          href="/back-office/direct"
        />

        <Kpi
          icon={Mail}
          label="Messages non lus"
          value={unreadMessages}
          accent={unreadMessages > 0}
          href="/back-office/contact"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Kpi
          icon={Newspaper}
          label="Actualités publiées"
          value={stats.actualites_publiees ?? 0}
          href="/back-office/actualites"
        />
        <Kpi
          icon={BookOpen}
          label="Articles publiés"
          value={articlesCount}
          href="/back-office/articles"
        />
        <Kpi
          icon={PlaySquare}
          label="Médias publiés"
          value={mediasCount}
          href="/back-office/medias"
        />
        <Kpi
          icon={FileEdit}
          label="Brouillons"
          value={stats.actualites_brouillon ?? 0}
          hint="Actualités non publiées"
          href="/back-office/actualites"
        />
      </div>

      <h2 className="mt-8 text-sm font-medium text-forest-900">Activité récente</h2>
      <div className="mt-3 flex flex-col divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-card-bg">
        {activity.length > 0 ? (
          activity.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-forest-50"
            >
              {item.kind === "actualite" && (
                <Newspaper size={16} className="shrink-0 text-forest-400" />
              )}
              {item.kind === "article" && (
                <BookOpen size={16} className="shrink-0 text-forest-400" />
              )}
              {item.kind === "media" && (
                <PlaySquare size={16} className="shrink-0 text-forest-400" />
              )}
              {item.kind === "direct" && <Radio size={16} className="shrink-0 text-forest-400" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-forest-900">{item.title}</p>
                <p className="text-xs text-forest-400">
                  {item.label} · {item.authorName} ·{" "}
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-sm text-forest-400">
            Aucune activité pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
