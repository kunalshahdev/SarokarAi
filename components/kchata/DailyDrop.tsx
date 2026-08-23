"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrending } from "./trending-store";

interface DropItem {
  num: string;
  title: string;
  category: string;
  source?: string;
  isDemo?: boolean;
}

const fallbackItems: DropItem[] = [
  {
    num: "01",
    title: "New digital literacy program launches in Kathmandu",
    category: "Tech",
    isDemo: true,
  },
  {
    num: "02",
    title: "Why NEB exam results are trending again",
    category: "Student Life",
    isDemo: true,
  },
  {
    num: "03",
    title: "The Pokhara-Bhairahawa flight route everyone is excited about",
    category: "Nepal",
    isDemo: true,
  },
  {
    num: "04",
    title: "Is this viral money-saving tip actually legit?",
    category: "Money",
    isDemo: true,
  },
  {
    num: "05",
    title: "A Nepali artist just got featured on a global playlist",
    category: "Music",
    isDemo: true,
  },
];

export default function DailyDrop() {
  const [items, setItems] = useState<DropItem[]>(fallbackItems);

  useEffect(() => {
    async function fetchLiveDrop() {
      try {
        const result = await getTrending();
        if (result.topics.length >= 3) {
          const liveDrops: DropItem[] = result.topics.slice(0, 5).map(
            (
              t: { title: string; category: string; source?: string },
              idx: number
            ) => ({
              num: String(idx + 1).padStart(2, "0"),
              title: t.title,
              category: t.category || "Nepal",
              source: t.source,
              isDemo: false,
            })
          );
          setItems(liveDrops);
        }
      } catch {}
    }
    fetchLiveDrop();
  }, []);

  return (
    <section id="daily-drop" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 bg-foreground text-background">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-background/50 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-kct-accent animate-pulse" />
              Updated live
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              Today&apos;s 5
            </h2>
            <p className="mt-2 text-base text-background/60">
              5 things happening on Nepal&apos;s feed right now.
            </p>
          </div>
        </div>

        {/* Numbered list */}
        <div className="space-y-0">
          {items.map((item, i) => (
            <Link
              key={i}
              href={`/k-cha-ta/chat?q=${encodeURIComponent(item.title)}`}
              className="group flex items-start gap-4 md:gap-6 py-6 md:py-7 border-t border-white/10 transition-colors hover:border-white/20"
            >
              <span className="text-3xl md:text-4xl font-bold text-background/15 group-hover:text-kct-accent transition-colors shrink-0 w-16 md:w-20">
                {item.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold leading-snug group-hover:text-kct-accent transition-colors">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs font-semibold text-background/40 uppercase tracking-wider">
                    {item.category} {item.source ? `· ${item.source}` : ""}
                  </span>
                  {item.isDemo && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-background/30 border border-white/10 px-2 py-0.5 rounded">
                      DEMO
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 mt-1.5 h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-kct-accent/30 group-hover:bg-kct-accent/10 transition-all">
                <svg
                  className="h-3.5 w-3.5 text-background/30 group-hover:text-kct-accent transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
}
