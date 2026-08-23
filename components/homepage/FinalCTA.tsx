import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
            Got something to figure out?
          </h2>
          <p className="mt-3 text-lg text-muted max-w-lg mx-auto">
            Start with a question. We&apos;ll help you find the next step — whether you&apos;re in Kathmandu or Kansas.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={1} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:bg-accent-hover active:scale-[0.98]"
          >
            Ask Nepal Assistant
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/k-cha-ta"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-base font-medium text-foreground transition-all hover:border-kct-accent/40 hover:bg-kct-surface active:scale-[0.98]"
          >
            Explore K Cha Ta?
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
