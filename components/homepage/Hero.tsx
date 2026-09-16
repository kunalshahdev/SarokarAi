"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AankhijhyalPattern from "@/components/brand/AankhijhyalPattern";
import NepalFlag from "@/components/brand/NepalFlag";

const suggestions = [
  { icon: "📋", label: "PAN banaunu cha" },
  { icon: "🛂", label: "Passport renew kasari?" },
  { icon: "🚗", label: "Driving licence ko next step?" },
  { icon: "📘", label: "Bluebook renew garna cha" },
];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <AankhijhyalPattern className="text-foreground" opacity={0.05} />

      {/* Faded Devanagari background text */}
      <span
        aria-hidden="true"
        className="text-devanagari-display pointer-events-none select-none absolute left-0 top-[15%] md:top-[10%] text-[120px] sm:text-[160px] md:text-[200px] leading-none opacity-[0.035] text-foreground whitespace-nowrap overflow-hidden"
        style={{ letterSpacing: "-0.03em" }}
      >
        सरोकार
      </span>

      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_420px] gap-12 md:gap-16 items-center">
          {/* Left */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              Smart guidance, Nepali roots — free, always
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-extrabold leading-[1.08] tracking-tight">
              Nepal ko kaam,
              <br />
              aba sajilo.
            </h1>

            <p className="mt-5 text-lg md:text-xl text-muted leading-relaxed max-w-lg">
              Government docs. Everyday questions. In Nepali, Roman Nepali, or English — figure out what you need, where to go, and what comes next.
            </p>

            {/* Search input */}
            <div className="mt-8 max-w-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(query);
                }}
                className="relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setQuery("");
                      inputRef.current?.blur();
                    }
                  }}
                  aria-label="Ask Sarokar a question"
                  placeholder='Try "mero passport renew garnu cha"'
                  className="h-14 md:h-16 w-full rounded-2xl border border-border bg-card pl-5 pr-36 text-base md:text-lg shadow-sm transition-all focus:border-[#1B2D5E] focus:outline-none focus:ring-2 focus:ring-[#1B2D5E]/10 focus:shadow-md"
                />
                {/* Clear button */}
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="absolute right-[5.5rem] top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 rounded-xl bg-[#1B2D5E] px-5 md:px-6 text-sm font-medium text-white transition-all hover:bg-[#0f1a3a] active:scale-[0.97] flex items-center gap-2"
                >
                  Ask
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-light">Try asking</span>
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSearch(s.label)}
                    className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3.5 text-xs text-muted transition-all hover:border-[#1B2D5E]/20 hover:text-foreground hover:bg-card"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Trust stats */}
              <dl className="mt-10 flex items-center gap-8 sm:gap-10">
                {[
                  { value: "50+", label: "Gov services" },
                  { value: "NE · EN · RN", label: "3 languages" },
                  { value: "Free", label: "Always" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                    <dd className="text-xs text-muted mt-0.5">{stat.label}</dd>
                  </div>
                ))}
              </dl>

              {/* Mobile-only compact visual */}
              <div aria-hidden="true" className="md:hidden mt-8 rounded-xl bg-card border border-border shadow-card p-3.5 animate-float-in">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">Driving Licence</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1B2D5E] bg-[#1B2D5E]/10 px-2 py-0.5 rounded">DOTM</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] flex items-center justify-center shrink-0">✓</span>
                    <span className="line-through text-muted-light">Learner permit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span className="h-4 w-4 rounded-full bg-[#1B2D5E] text-white font-bold text-[9px] flex items-center justify-center shrink-0">2</span>
                    <span>Written Test &amp; Trial — next step</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — visual composition */}
          <div aria-hidden="true" className="hidden md:block relative">
            <div className="relative w-full aspect-square max-w-[440px]">
              {/* Background accent glow */}
              <div className="absolute inset-6 rounded-3xl bg-[#1B2D5E]/5 rotate-3 blur-sm" />

              {/* Card 1: Passport Status */}
              <div className="absolute top-0 right-4 w-60 rounded-2xl bg-card border border-border shadow-card p-4 rotate-2 hover:rotate-0 hover:shadow-card-hover transition-all duration-300 animate-float-in">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-[#1B2D5E] bg-[#1B2D5E]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">e-Passport</span>
                  <span className="text-[10px] text-muted font-medium">Step 3 of 5</span>
                </div>
                <p className="text-xs font-semibold text-foreground">Dept of Passport (Tripureshwor)</p>
                <div className="mt-2.5 space-y-1.5 text-[11px] text-muted">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>Biometric appointment set</span>
                  </div>
                  <div className="text-[10px] text-muted-light pl-5">Sunday 11:30 AM &middot; Counter #4</div>
                </div>
              </div>

              {/* Card 2: PAN Card info */}
              <div className="absolute top-24 left-0 w-56 rounded-2xl bg-card border border-border shadow-card p-4 -rotate-3 hover:rotate-0 hover:shadow-card-hover transition-all duration-300 animate-float-in stagger-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-7 w-7 rounded-lg bg-[#1B2D5E]/10 text-[#1B2D5E] flex items-center justify-center font-bold text-xs">
                    IRD
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Personal PAN</p>
                    <p className="text-[10px] text-muted">Issued on-the-spot</p>
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-surface/60 p-2 text-[11px] text-muted leading-tight">
                  📄 Citizenship Copy + 1 Photo needed
                </div>
              </div>

              {/* Card 3: Driving Licence Trial */}
              <div className="absolute bottom-10 right-0 w-64 rounded-2xl bg-card border border-border shadow-card p-4 rotate-1 hover:rotate-0 hover:shadow-card-hover transition-all duration-300 animate-float-in stagger-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-foreground">Driving Licence</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#1B2D5E] bg-[#1B2D5E]/10 px-2 py-0.5 rounded">DOTM</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span className="h-4 w-4 rounded-full bg-[#1B2D5E]/10 text-[#1B2D5E] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span className="line-through text-muted-light">Learner permit</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
                    <span className="h-4 w-4 rounded-full bg-[#1B2D5E] text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span>Written Test &amp; Trial</span>
                  </div>
                </div>
              </div>

              {/* Card 4: National ID Badge */}
              <div className="absolute bottom-2 left-6 rounded-xl bg-[#1B2D5E] text-white shadow-card px-3.5 py-2.5 -rotate-2 flex items-center gap-2 text-xs font-medium animate-float-in stagger-6">
                <NepalFlag className="h-4 w-4" />
                <span>NID Enrollment ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
