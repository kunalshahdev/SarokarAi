"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getTrending, loadCachedTrending, TRENDING_CACHE_TTL_MS, type TrendingTopic } from "./trending-store";
import NewsDrawer, { type DrawerTopic } from "./NewsDrawer";

const demoTopics: TrendingTopic[] = [
  {
    id: "1",
    title: "Why is everyone talking about the new education policy?",
    explanation:
      "The government announced changes to the +2 curriculum that affect how streams are divided. Students and parents are confused about the timeline.",
    category: "Nepal",
    time: "2h ago",
    isDemo: true,
  },
  {
    id: "2",
    title: "What happened with the internet shutdown scare?",
    explanation:
      "Rumors spread about a potential internet restriction. Here's what was actually proposed vs what people think happened.",
    category: "Tech",
    time: "4h ago",
    isDemo: true,
  },
  {
    id: "3",
    title: "Why is everyone posting about Pokhara airport?",
    explanation:
      "New flight routes and a viral video of the runway view got people talking about Pokhara's tourism future.",
    category: "Trending",
    time: "6h ago",
    isDemo: true,
  },
  {
    id: "4",
    title: "Is the new job portal actually useful?",
    explanation:
      "The government launched a job matching portal. We looked into whether it actually works or if it's another dead link.",
    category: "Jobs",
    time: "8h ago",
    isDemo: true,
  },
  {
    id: "5",
    title: "What's the deal with the new crypto regulation?",
    explanation:
      "Nepal Rastra Bank issued a notice about digital assets. Here's what it means for anyone holding or trading.",
    category: "Money",
    time: "12h ago",
    isDemo: true,
  },
  {
    id: "6",
    title: "This viral NEPALI song just hit 10M views",
    explanation:
      "A Nepali indie artist's track went viral on YouTube. We break down why it resonated with young audiences.",
    category: "Music",
    time: "1d ago",
    isDemo: true,
  },
];

const categoryColors: Record<string, string> = {
  Nepal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  Tech: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Trending: "bg-red-500/10 text-red-600 dark:text-red-400",
  Sports: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  Jobs: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Money: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Entertainment: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  Music: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

function timeSince(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function TrendingNow() {
  const [topics, setTopics] = useState<TrendingTopic[]>(demoTopics);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<DrawerTopic | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTrending = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);

    try {
      const result = await getTrending(showRefresh);
      if (result.topics.length > 0) {
        setTopics(result.topics);
        setIsLive(result.live);
        setLastUpdated(result.cachedAt ?? loadCachedTrending()?.cachedAt ?? Date.now());
      }
    } finally {
      if (showRefresh) setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchTrending();

    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchTrending(true);
      }
    }, TRENDING_CACHE_TTL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const cached = loadCachedTrending();
        if (cached && Date.now() - cached.cachedAt >= TRENDING_CACHE_TTL_MS) {
          fetchTrending(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchTrending]);

  return (
    <section id="trending" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              What&apos;s everyone talking about?
            </h2>
            <p className="mt-3 text-lg text-kct-muted">
              {isLive ? "Fresh from Nepali news sources." : "The biggest conversations happening right now."}
            </p>
          </div>
          {isLive && lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-kct-muted-light shrink-0">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${isRefreshing ? "bg-kct-accent animate-pulse" : "bg-emerald-500"}`} />
              Updated {timeSince(lastUpdated)}
            </div>
          )}
        </div>

        {/* Editorial grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`rounded-2xl border border-kct-border bg-kct-card p-6 md:p-7 ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-20 rounded-lg bg-kct-surface animate-pulse" />
                  <div className="h-4 w-12 rounded bg-kct-surface animate-pulse" />
                </div>
                <div className="h-6 w-full rounded bg-kct-surface animate-pulse" />
                <div className="mt-2 h-6 w-3/4 rounded bg-kct-surface animate-pulse" />
                <div className="mt-4 h-4 w-full rounded bg-kct-surface animate-pulse" />
                <div className="mt-2 h-4 w-5/6 rounded bg-kct-surface animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {topics.map((topic, i) => (
            <div
              key={topic.id}
              role="button"
              tabIndex={0}
              onClick={() =>
                setSelectedTopic({
                  id: topic.id,
                  title: topic.title,
                  source: topic.source,
                  time: topic.time,
                  url: topic.link,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTopic({
                    id: topic.id,
                    title: topic.title,
                    source: topic.source,
                    time: topic.time,
                    url: topic.link,
                  });
                }
              }}
              aria-label={`Read AI summary: ${topic.title}`}
              className={`
                group relative flex flex-col justify-between rounded-2xl border border-kct-border bg-kct-card p-6 md:p-7 shadow-card cursor-pointer
                transition-all duration-200
                hover:border-kct-accent/30 hover:shadow-card-hover hover:-translate-y-0.5
                ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}
                ${i === 5 ? "md:col-span-2 lg:col-span-1" : ""}
              `}
            >
              <div>
                {/* Category + time */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      categoryColors[topic.category] || "bg-kct-surface text-kct-muted"
                    }`}
                  >
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {topic.isDemo && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-kct-muted-light bg-kct-surface px-2 py-0.5 rounded">
                        DEMO
                      </span>
                    )}
                    {topic.source && !topic.isDemo && (
                      <span className="text-[10px] font-medium text-kct-muted-light">
                        {topic.source}
                      </span>
                    )}
                    <span className="text-xs text-kct-muted-light">{topic.time}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className={`font-bold leading-tight tracking-tight text-foreground group-hover:text-kct-accent transition-colors duration-200 ${
                  i === 0 ? "text-xl md:text-2xl" : "text-lg"
                }`}>
                  {topic.title}
                </h3>

                {/* Explanation */}
                <p className="mt-3 text-sm text-kct-muted leading-relaxed line-clamp-3">
                  {topic.explanation}
                </p>
              </div>

              {/* Action row */}
              <div className="mt-5 flex items-center justify-between pt-2 border-t border-kct-border/40">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-kct-accent group-hover:underline">
                  Summarize with AI
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>

                {topic.link && topic.link.startsWith("http") && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(topic.link, "_blank", "noopener,noreferrer");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(topic.link, "_blank", "noopener,noreferrer");
                      }
                    }}
                    aria-label={`Open original article: ${topic.title}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-kct-muted hover:text-foreground hover:underline transition-colors"
                  >
                    Original article
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* News drawer */}
        {selectedTopic && (
          <NewsDrawer
            key={selectedTopic.id}
            topic={selectedTopic}
            onClose={() => setSelectedTopic(null)}
          />
        )}

        {/* Disclaimer */}
        {!isLive && !loading && (
          <p className="mt-8 text-xs text-kct-muted-light text-center">
            Topics shown are for demonstration purposes. Live trending data coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
