import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import MandalaRosette from "@/components/brand/MandalaRosette";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 border-t border-border">
      <MandalaRosette className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] md:h-[520px] md:w-[520px] text-[#1B2D5E] opacity-[0.05]" />

      {/* Faded Devanagari backdrop */}
      <span
        aria-hidden="true"
        className="text-devanagari-display pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[130px] md:text-[180px] text-foreground opacity-[0.03] whitespace-nowrap"
      >
        सहयोग
      </span>

      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8 text-center">
        <ScrollReveal>
          <p className="text-sm font-medium text-[#1B2D5E] dark:text-[#F5A623] uppercase tracking-widest mb-3">
            Nepal&apos;s AI guide
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[52px] font-extrabold tracking-tight leading-tight">
            Kaam cha?{" "}
            <span className="text-[#1B2D5E] dark:text-[#F5A623]">Sarokar cha.</span>
          </h2>
          <p className="mt-4 text-lg text-muted max-w-lg mx-auto">
            Free, always. In Nepali, Roman Nepali, or English — wherever you are in the world.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={1} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #1B2D5E 0%, #2a4080 100%)" }}
          >
            Ask Nepal Assistant
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/k-cha-ta"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-foreground transition-all hover:border-[#F5A623]/40 hover:bg-amber-50 dark:hover:bg-amber-950/20 active:scale-[0.98]"
          >
            🔥 Explore K Cha Ta?
          </Link>
        </ScrollReveal>

        {/* Stat line */}
        <ScrollReveal delay={2} className="mt-10 flex items-center justify-center gap-6 text-sm text-muted">
          <span>50+ services covered</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>3 languages</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Free forever</span>
        </ScrollReveal>
      </div>
    </section>
  );
}
