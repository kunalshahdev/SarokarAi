"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTrending, type TrendingTopic } from "./trending-store";
import NewsDrawer, { type DrawerTopic } from "./NewsDrawer";

const heroChips = [
  { label: "🔥 What's Trending", query: "What is trending today in Nepal?" },
  { label: "💻 Tech & Gadgets", query: "What are the latest tech and gadget updates in Nepal?" },
  { label: "💼 Job & Lok Sewa", query: "What are the latest job vacancies and Lok Sewa updates?" },
  { label: "🏛️ Policy & Politics", query: "Explain recent government policy and political news in Nepal" },
  { label: "🎬 Viral & Culture", query: "What viral clips or internet culture trends are happening in Nepal?" },
  { label: "💰 Money & Economy", query: "What's happening in Nepal's market, banking, or economy?" },
  { label: "🏏 Sports & Cricket", query: "What's the latest in Nepali sports and cricket?" },
];

const inputPlaceholders = [
  'Try "Ke ko barema kura garne?"',
  'Try "K trend ma cha aile Nepal ma?"',
  'Try "Yo k ho sabai le post gardai chan?"',
  'Try "Is this rumor or fact?"',
  'Try "Explain like I\'m from Nepal"',
];

export default function KChaTaHero() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [trendTopics, setTrendTopics] = useState<TrendingTopic[]>([]);
  const [trendState, setTrendState] = useState<"loading" | "live" | "sample">("loading");
  const [drawerTopic, setDrawerTopic] = useState<DrawerTopic | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTrending().then((result) => {
      if (cancelled) return;
      if (result.live && result.topics.length > 0) {
        setTrendTopics(result.topics.slice(0, 2));
        setTrendState("live");
      } else {
        setTrendState("sample");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (query: string) => {
    if (!query.trim()) return;
    router.push(`/k-cha-ta/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (query: string) => {
    setInput(query);
    handleSubmit(query);
  };

  const cyclePlaceholder = () => {
    setPlaceholderIdx((prev) => (prev + 1) % inputPlaceholders.length);
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FFFDF5] via-[#FFF8EB] to-[#FFFBF0] dark:from-[#14120C] dark:via-[#1A1710] dark:to-[#12120F]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-400/15 via-orange-400/10 to-red-400/5 blur-3xl pointer-events-none rounded-full" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div>
            {/* Glass Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-amber-700 dark:text-amber-300 shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>K Cha Ta? by Sarokar</span>
              <span className="text-amber-500/40">&middot;</span>
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Nepal Internet Culture
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-extrabold leading-[1.08] tracking-tight text-foreground">
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
                K Cha Ta?
              </span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-devanagari text-kct-muted leading-relaxed font-medium">
              नेपालको internet ma k chaldai cha?
            </p>
            <p className="mt-2 text-sm sm:text-base text-kct-muted/80 max-w-lg leading-relaxed">
              Understand viral trends, verify rumors, and break down what everyone in Nepal is talking about.
            </p>

            {/* Input Search Box */}
            <div className="mt-8 max-w-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(input);
                }}
                className="relative flex items-center shadow-lg rounded-2xl"
              >
                <div className="absolute left-4 text-kct-muted pointer-events-none">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  aria-label="Ask K Cha Ta"
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={cyclePlaceholder}
                  placeholder={inputPlaceholders[placeholderIdx]}
                  className="h-16 w-full rounded-2xl border border-kct-border bg-kct-card pl-12 pr-36 text-base sm:text-lg font-medium text-foreground transition-all duration-200 focus:border-kct-accent focus:outline-none focus:ring-4 focus:ring-kct-accent/10 placeholder:text-kct-muted-light"
                />
                <button
                  type="submit"
                  className="absolute right-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 sm:px-7 h-12 text-sm font-bold text-white transition-all hover:opacity-95 active:scale-[0.97] flex items-center gap-1.5 shadow-md"
                >
                  Sodh
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>

              {/* Topic Chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-kct-muted-light mr-1">Quick Ask:</span>
                {heroChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChipClick(chip.query)}
                    className="min-h-11 inline-flex items-center rounded-xl border border-kct-border bg-kct-card/90 px-3.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-kct-accent/40 hover:bg-kct-accent-light hover:text-kct-accent hover:shadow-xs active:scale-[0.96]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Live Trend Preview Widget */}
          <div className="hidden lg:block relative">
            <div className="relative mx-auto w-full max-w-[420px]">
              {/* Decorative Card Stack */}
              <div className="absolute -top-3 -right-3 inset-0 rounded-3xl bg-amber-500/10 rotate-3 border border-amber-500/10" />

              {/* Main Card */}
              <div className="relative rounded-3xl border border-kct-border bg-kct-card p-6 shadow-xl space-y-4 backdrop-blur-xl">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-kct-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-2.5 w-2.5 rounded-full ${trendState === "loading" ? "bg-kct-muted animate-pulse" : trendState === "live" ? "bg-emerald-500 animate-pulse" : "bg-kct-muted"}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      🔥 Live Trend Radar
                    </span>
                  </div>
                  {trendState !== "loading" && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${trendState === "live" ? "text-emerald-600 bg-emerald-500/10" : "text-kct-muted bg-kct-surface"}`}>
                      {trendState === "live" ? "Live" : "Sample"}
                    </span>
                  )}
                </div>

                {/* Trending Preview Items */}
                {trendState === "loading" && (
                  <div className="space-y-3" aria-hidden="true">
                    {[0, 1].map((i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-kct-surface border border-kct-border/60">
                        <div className="h-3.5 w-24 rounded bg-kct-border animate-pulse mb-2" />
                        <div className="h-4 w-3/4 rounded bg-kct-border animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}

                {trendState === "sample" && (
                  <div className="space-y-3">
                    <p className="text-xs text-kct-muted leading-relaxed p-3.5 rounded-2xl bg-kct-surface border border-kct-border/60">
                      Trends are loading from Nepali news feeds — see the live list in
                      {" "}
                      <a href="/k-cha-ta#trending" className="font-bold text-kct-accent hover:underline">What&apos;s everyone talking about</a>
                      {" "}below.
                    </p>
                  </div>
                )}

                {trendState === "live" && (
                  <div className="space-y-3">
                    {trendTopics.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() =>
                          setDrawerTopic({
                            id: topic.id,
                            title: topic.title,
                            source: topic.source,
                            time: topic.time,
                            url: topic.link,
                          })
                        }
                        className="w-full text-left cursor-pointer group p-3.5 rounded-2xl bg-kct-surface hover:bg-amber-500/10 transition-all duration-200 border border-kct-border/60"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-kct-muted mb-1">
                          <span className="uppercase">{topic.category}</span>
                          <span>{topic.time}</span>
                        </div>
                        <p className="text-xs font-bold text-foreground group-hover:text-kct-accent transition-colors">
                          {topic.title}
                        </p>
                        <p className="text-[11px] text-kct-muted mt-1 line-clamp-1">
                          {topic.explanation}
                          {topic.source ? ` · ${topic.source}` : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-kct-muted">
                  <span className={`flex items-center gap-1 font-semibold ${trendState === "live" ? "text-amber-600" : ""}`}>
                    <span>⚡️</span> {trendState === "live" ? "Live RSS Feed Active" : trendState === "sample" ? "Sample preview" : "Connecting to feed…"}
                  </span>
                  <span className="text-[11px]">{trendState === "live" ? "Updated min-by-min" : "Live feed below"}</span>
                </div>
              </div>

              {/* Floating Pill Accents */}
              <div aria-hidden="true" className="absolute -bottom-4 -left-4 rounded-xl bg-foreground text-background text-xs font-bold px-3.5 py-2 shadow-lg -rotate-3 flex items-center gap-1.5">
                <span>👀</span>
                <span>Nepal Internet Culture</span>
              </div>
              <div aria-hidden="true" className="absolute -top-4 -left-6 rounded-xl bg-amber-500 text-white text-xs font-bold px-3.5 py-2 shadow-lg rotate-2 flex items-center gap-1.5">
                <span>🔥</span>
                <span>Real-Time Context</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {drawerTopic && (
        <NewsDrawer
          key={drawerTopic.id}
          topic={drawerTopic}
          onClose={() => setDrawerTopic(null)}
        />
      )}
    </section>
  );
}
