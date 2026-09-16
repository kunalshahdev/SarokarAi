"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NepalFlag from "@/components/brand/NepalFlag";

const modes = [
  { id: "explain", label: "Explain", icon: "\uD83E\uDDE0" },
  { id: "chill", label: "Chill", icon: "\uD83D\uDE02" },
  { id: "tldr", label: "TL;DR", icon: "\u26A1" },
  { id: "nepali", label: "Nepali", icon: <NepalFlag className="h-3.5 w-3.5" /> },
  { id: "roman", label: "Roman Nepali", icon: "\u2328\uFE0F" },
  { id: "deep", label: "Deep Dive", icon: "\uD83E\uDD0D" },
];

const exampleQuestions = [
  "Why is everyone talking about this?",
  "Yo sabai kina trend ma cha?",
  "Context plz, what actually happened?",
  "Is this real or just internet noise?",
  "Bujhaideu, ali simple ma",
  "Give me the no bakwas version",
];

export default function ExplainThis() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState("explain");

  const handleAsk = (question: string) => {
    router.push(
      `/k-cha-ta/chat?q=${encodeURIComponent(question)}&mode=${activeMode}`
    );
  };

  return (
    <section id="explain-this" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 bg-kct-surface border-t border-kct-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
            Explain this.
          </h2>
          <p className="mt-3 text-lg text-kct-muted">
            Pick how you want it explained. From deep dive to no bakwas.
          </p>
        </div>

        {/* Mode pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={activeMode === mode.id}
              className={`
                min-h-11 inline-flex items-center gap-1.5 rounded-xl px-4 text-sm font-semibold
                transition-all duration-200
                ${
                  activeMode === mode.id
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-kct-card border border-kct-border text-kct-muted hover:border-kct-accent/30 hover:text-foreground"
                }
              `}
            >
              <span>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Example questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {exampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="group text-left rounded-xl border border-kct-border bg-kct-card p-5 shadow-card transition-all duration-200 hover:border-kct-accent/30 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <p className="text-base font-medium text-foreground leading-snug">
                &ldquo;{q}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-kct-accent opacity-60 transition-all duration-300 group-hover:opacity-100">
                Ask in {modes.find((m) => m.id === activeMode)?.label}
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
