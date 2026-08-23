"use client";

import Link from "next/link";
import { useState } from "react";

const interests = [
  { id: "tech", label: "Tech", icon: "\uD83D\uDCBB" },
  { id: "football", label: "Football", icon: "\u26BD" },
  { id: "music", label: "Music", icon: "\uD83C\uDFB5" },
  { id: "jobs", label: "Jobs", icon: "\uD83D\uDCBC" },
  { id: "study-abroad", label: "Study Abroad", icon: "\u2708\uFE0F" },
  { id: "nepal", label: "Nepal", icon: "\uD83C\uDDF5\uD83C\uDDF3" },
  { id: "business", label: "Business", icon: "\uD83D\uDE80" },
  { id: "entertainment", label: "Entertainment", icon: "\uD83C\uDFAC" },
];

function getInitialSelected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("kct-interests");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function PersonalizedFeed() {
  const [selected, setSelected] = useState<string[]>(getInitialSelected);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("kct-interests", JSON.stringify(next));
      return next;
    });
  };

  const selectedLabels = selected
    .map((id) => interests.find((i) => i.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const exploreHref =
    selectedLabels.length > 0
      ? `/k-cha-ta/chat?q=${encodeURIComponent(
          `Suggest something from my interests (${selectedLabels.join(", ")}). What's happening on Nepal's internet right now?`
        )}`
      : "/k-cha-ta/chat";

  return (
    <section className="py-16 md:py-24 bg-kct-surface border-t border-kct-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 text-center">
        <div className="max-w-lg mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-tight leading-[1.1]">
            Your feed
          </h2>
          <p className="mt-3 text-lg text-kct-muted">
            Pick what you care about. We&apos;ll keep you in the loop.
          </p>
        </div>

        {/* Interest chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggle(interest.id)}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                selected.includes(interest.id)
                  ? "border-kct-accent bg-kct-accent text-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                  : "border-kct-border bg-kct-card text-kct-muted hover:border-foreground/20 hover:text-foreground hover:shadow-[2px_2px_0px_rgba(0,0,0,0.04)]"
              }`}
            >
              <span className="text-lg">{interest.icon}</span>
              {interest.label}
            </button>
          ))}
        </div>

        <Link
          href={exploreHref}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-bold text-background transition-all hover:bg-foreground/90 active:scale-[0.98] shadow-[3px_3px_0px_rgba(0,0,0,0.08)]"
        >
          Start exploring
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <p className="mt-4 text-xs text-kct-muted-light">
          {selectedLabels.length > 0
            ? `Your picks (${selectedLabels.join(", ")}) shape the first answer you get.`
            : "Pick topics above and they shape your first answer."}
        </p>
      </div>
    </section>
  );
}
