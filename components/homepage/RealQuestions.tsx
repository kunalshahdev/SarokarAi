"use client";

import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/shared/ScrollReveal";

const questions = [
  { text: "mero citizenship harayo", lang: "Roman Nepali" },
  { text: "PAN banauna k chaincha?", lang: "Roman Nepali" },
  { text: "bluebook renew garna cha", lang: "Roman Nepali" },
  { text: "passport appointment kasari line?", lang: "Roman Nepali" },
  { text: "driving trial fail bhayo, aba?", lang: "Roman Nepali" },
  { text: "How do I renew my passport?", lang: "English" },
];

export default function RealQuestions() {
  const router = useRouter();

  return (
    <section id="explore" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-[1fr_1.2fr] md:gap-16 items-start">
          <div className="mb-10 md:mb-0 md:sticky md:top-32">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
                Ask it like you
                <br />
                normally would.
              </h2>
              <p className="mt-3 text-lg text-muted">
                No formal language needed. Just type what you need.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <button
                key={i}
                onClick={() => router.push(`/chat?q=${encodeURIComponent(q.text)}`)}
                className="w-full text-left group flex items-center gap-4 rounded-xl border border-border bg-card p-4 md:p-5 shadow-card transition-all duration-200 hover:border-accent/20 hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="flex-1">
                  <p className="text-base md:text-lg font-medium text-foreground">
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-muted-light">{q.lang}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent/10">
                  <svg className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
