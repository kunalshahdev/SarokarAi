"use client";

import { useRouter } from "next/navigation";

const prompts = [
  { text: "Explain this trend.", icon: "\uD83E\uDDE0" },
  { text: "Is this actually true?", icon: "\u2753" },
  { text: "Why is everyone talking about it?", icon: "\uD83D\uDC40" },
  { text: "Roman Nepali ma explain gara.", icon: "\u2328\uFE0F" },
  { text: "Give me the 30-second version.", icon: "\u26A1" },
  { text: "Give me the full context.", icon: "\uD83D\uDCD6" },
  { text: "What's the source?", icon: "\uD83D\uDD17" },
  { text: "Is this rumor or fact?", icon: "\uD83D\uDD0D" },
];

export default function AskAnything() {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 border-t border-kct-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-[1fr_1.4fr] md:gap-16 items-start">
          {/* Left */}
          <div className="mb-10 md:mb-0 md:sticky md:top-28">
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-tight leading-[1.1]">
              K sodhne?
            </h2>
            <p className="mt-3 text-lg text-kct-muted leading-relaxed">
              Ask anything. From trends to career advice, we&apos;ll break it down.
            </p>
          </div>

          {/* Right - prompt cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() =>
                  router.push(
                    `/k-cha-ta/chat?q=${encodeURIComponent(prompt.text)}`
                  )
                }
                className="group text-left flex items-start gap-3 rounded-xl border-2 border-kct-border bg-kct-card p-4 md:p-5 transition-all duration-200 hover:border-foreground/15 hover:shadow-[3px_3px_0px_rgba(0,0,0,0.04)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
              >
                <span className="text-xl mt-0.5 shrink-0">{prompt.icon}</span>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground leading-snug">
                    &ldquo;{prompt.text}&rdquo;
                  </p>
                </div>
                <div className="shrink-0 mt-1 h-7 w-7 rounded-full bg-kct-surface flex items-center justify-center group-hover:bg-kct-accent/10 transition-colors">
                  <svg className="h-3 w-3 text-kct-muted group-hover:text-kct-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
