"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/shared/ScrollReveal";

const examples = [
  {
    lang: "English",
    text: "How do I renew my passport?",
  },
  {
    lang: "नेपाली",
    text: "पासपोर्ट कसरी नवीकरण गर्ने?",
  },
  {
    lang: "Roman Nepali",
    text: "passport kasari renew garne?",
  },
];

export default function LanguageSection() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-16 items-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              Say it your way.
            </h2>
            <p className="mt-3 text-lg text-muted">
              English, नेपाली, or Roman Nepali — we understand all three. Tap a card to try it.
            </p>
          </ScrollReveal>

          <div className="mt-10 md:mt-0 space-y-4">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => router.push(`/chat?q=${encodeURIComponent(ex.text)}`)}
                aria-label={`Ask: ${ex.text}`}
                className="w-full text-left rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.99] group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-light uppercase tracking-wider mb-2">
                    {ex.lang}
                  </p>
                  <svg className="h-4 w-4 text-muted-light opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <p className={`text-lg font-medium ${i === 1 ? "font-devanagari" : ""}`}>
                  &ldquo;{ex.text}&rdquo;
                </p>
              </button>
            ))}
            <p className="text-sm text-muted pt-2">
              Same intent &rarr; Same guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
