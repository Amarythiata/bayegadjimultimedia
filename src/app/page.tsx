import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/home/hero";
import { StatsBand, type HomeStats } from "@/components/home/stats-band";
import { FeaturedContent } from "@/components/home/featured-content";
import { MediaShowcase } from "@/components/home/media-showcase";
import { RadioCalendarBand } from "@/components/home/radio-calendar-band";
import { HomeFooter } from "@/components/home/home-footer";
import type { ArticleRow, LiveEventRow, MediaRow, NewsRow } from "@/lib/types/database";

async function getHomeData() {
  try {
    const supabase = await createClient();

    const [
      { data: live },
      { data: recentNews },
      { data: recentArticles },
      { data: recentMedias },
      { data: upcomingEvents },
      { count: newsCount },
      { count: articlesCount },
      { count: mediasCount },
      { count: livesCount },
    ] = await Promise.all([
      supabase
        .from("live_events")
        .select("*")
        .eq("status", "en_cours")
        .order("scheduled_start", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("news")
        .select("*")
        .eq("status", "publie")
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("articles")
        .select("*")
        .eq("status", "publie")
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("medias")
        .select("*")
        .eq("status", "publie")
        .order("published_at", { ascending: false })
        .limit(4),
      supabase
        .from("live_events")
        .select("*")
        .in("status", ["a_venir", "en_cours"])
        .order("scheduled_start", { ascending: true })
        .limit(3),
      supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "publie"),
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "publie"),
      supabase.from("medias").select("id", { count: "exact", head: true }).eq("status", "publie"),
      supabase.from("live_events").select("id", { count: "exact", head: true }),
    ]);

    return {
      live: (live as LiveEventRow | null) ?? null,
      news: (recentNews as NewsRow[] | null) ?? [],
      articles: (recentArticles as ArticleRow[] | null) ?? [],
      medias: (recentMedias as MediaRow[] | null) ?? [],
      upcomingEvents: (upcomingEvents as LiveEventRow[] | null) ?? [],
      stats: {
        news: newsCount ?? 0,
        articles: articlesCount ?? 0,
        medias: mediasCount ?? 0,
        lives: livesCount ?? 0,
      } satisfies HomeStats,
    };
  } catch {
    return {
      live: null,
      news: [] as NewsRow[],
      articles: [] as ArticleRow[],
      medias: [] as MediaRow[],
      upcomingEvents: [] as LiveEventRow[],
      stats: { news: 0, articles: 0, medias: 0, lives: 0 } satisfies HomeStats,
    };
  }
}

export default async function HomePage() {
  const { live, news, articles, medias, upcomingEvents, stats } = await getHomeData();
  const [featured, ...restNews] = news;

  return (
    <>
      <Hero live={live} />
      <StatsBand stats={stats} />
      <FeaturedContent featured={featured ?? null} news={restNews} articles={articles} />
      <MediaShowcase medias={medias} />
      <RadioCalendarBand upcoming={upcomingEvents} />
      <HomeFooter />
    </>
  );
}
