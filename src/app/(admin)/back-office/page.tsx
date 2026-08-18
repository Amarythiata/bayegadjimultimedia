import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Newspaper, FileEdit, Radio, BookOpen, PlaySquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

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
    { data: recentNews },
    { data: recentArticles },
    { data: recentMedias },
    { data: recentLive },
  ] = await Promise.all([
    supabase.from("dashboard_stats").select("*").single(),
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
    activity,
  };
}

export default async function BackOfficeDashboardPage() {
  const { stats, activity } = await getDashboardData();

  return (
    <div>
      <h1 className="text-lg font-medium text-forest-900 md:text-xl">Tableau de bord</h1>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border-subtle bg-card-bg p-4">
          <div className="flex items-center gap-2 text-forest-400">
            <Newspaper size={16} />
            <p className="text-xs">Actualités publiées</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-forest-900">
            {stats.actualites_publiees}
          </p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-card-bg p-4">
          <div className="flex items-center gap-2 text-forest-400">
            <FileEdit size={16} />
            <p className="text-xs">Brouillons</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-forest-900">
            {stats.actualites_brouillon}
          </p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-card-bg p-4">
          <div className="flex items-center gap-2 text-forest-400">
            <Radio size={16} />
            <p className="text-xs">Direct</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-forest-900">
            {stats.direct_en_cours ? (
              <span className="text-live-600">En cours</span>
            ) : (
              "Aucun"
            )}
          </p>
        </div>
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
