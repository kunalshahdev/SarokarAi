import ScrollReveal from "@/components/shared/ScrollReveal";
import HimalayaRidge from "@/components/brand/HimalayaRidge";

const steps = [
  {
    number: "01",
    title: "You ask normally.",
    example: '"mero passport renew garnu cha"',
  },
  {
    number: "02",
    title: "We understand your situation.",
    example: "The assistant asks only what matters.",
  },
  {
    number: "03",
    title: "You get your path.",
    example: "Documents. Steps. Where to go. Official source.",
  },
  {
    number: "04",
    title: "You know what's next.",
    example: "Clear progress. No confusion.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 md:scroll-mt-28 relative overflow-hidden py-20 md:py-28 bg-dark text-white">
      <HimalayaRidge className="h-20 md:h-28 text-white" />
      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        <ScrollReveal className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
            Tell us what you&apos;re trying to do.
          </h2>
          <p className="mt-3 text-lg text-dark-muted">
            We&apos;ll guide you through the rest.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={(i + 1) as 1 | 2 | 3 | 4} className="relative">
              {/* Connector line (desktop) — spans the grid gap between cards */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute top-7 left-full w-8 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.25), rgba(255,255,255,0.06))",
                  }}
                />
              )}

              <div className="text-5xl font-extrabold text-white/10 mb-4 tabular-nums">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-dark-muted leading-relaxed">
                {step.example}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
