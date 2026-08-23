"use client";

import { useRouter } from "next/navigation";
import AankhijhyalPattern from "@/components/brand/AankhijhyalPattern";
import NepalFlag from "@/components/brand/NepalFlag";

const suggestions = [
  "PAN banaunu cha",
  "Passport renew kasari garne?",
  "Driving licence ko next step?",
  "Bluebook renew garna cha",
];

export default function Hero() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <AankhijhyalPattern className="text-foreground" opacity={0.07} />
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_420px] gap-12 md:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              AI-powered guide for Nepal — from Kathmandu to the world
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-extrabold leading-[1.08] tracking-tight">
              Nepal ko kaam,
              <br />
              aba sajilo.
            </h1>

            <p className="mt-5 text-lg md:text-xl text-muted leading-relaxed max-w-lg">
              Government processes, documents, and everyday questions — figure out what you need, where to go, and what comes next. Wherever in the world you are.
            </p>

            {/* Search input */}
            <div className="mt-8 max-w-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.target as HTMLFormElement).querySelector("input");
                  if (input?.value.trim()) handleSearch(input.value.trim());
                }}
                className="relative"
              >
                <input
                  type="text"
                  aria-label="Ask Sarokar a question"
                  placeholder='Try "mero passport renew garnu cha"'
                  className="h-14 md:h-16 w-full rounded-2xl border border-border bg-card pl-5 pr-32 text-base md:text-lg shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 focus:shadow-md"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 rounded-xl bg-foreground px-5 md:px-6 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.97] flex items-center gap-2"
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
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="min-h-11 inline-flex items-center rounded-lg border border-border bg-card/60 px-3.5 text-xs text-muted transition-all hover:border-accent/20 hover:text-foreground hover:bg-card"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Trust stats */}
              <dl className="mt-10 flex items-center gap-8 sm:gap-10">
                {[
                  { value: "50+", label: "Gov services" },
                  { value: "EN · NE", label: "Bilingual" },
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
                  <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">DOTM</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="h-4 w-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] flex items-center justify-center shrink-0">✓</span>
                    <span className="line-through text-muted-light">Learner permit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <span className="h-4 w-4 rounded-full bg-accent text-white font-bold text-[9px] flex items-center justify-center shrink-0">2</span>
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
              <div className="absolute inset-6 rounded-3xl bg-accent/5 rotate-3 blur-sm" />

              {/* Card 1: Passport Status */}
              <div className="absolute top-0 right-4 w-60 rounded-2xl bg-card border border-border shadow-card p-4 rotate-2 hover:rotate-0 hover:shadow-card-hover transition-all duration-300 animate-float-in">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-wider">e-Passport</span>
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
                  <div className="h-7 w-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs">
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
                  <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">DOTM</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span className="h-4 w-4 rounded-full bg-accent/10 text-accent font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span className="line-through text-muted-light">Learner permit</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
                    <span className="h-4 w-4 rounded-full bg-accent text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span>Written Test &amp; Trial</span>
                  </div>
                </div>
              </div>

              {/* Card 4: National ID Badge */}
              <div className="absolute bottom-2 left-6 rounded-xl bg-foreground text-background shadow-card px-3.5 py-2.5 -rotate-2 flex items-center gap-2 text-xs font-medium animate-float-in stagger-6">
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
