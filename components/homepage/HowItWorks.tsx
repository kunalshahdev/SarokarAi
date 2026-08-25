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
    <section
      id="how-it-works"
      className="scroll-mt-24 md:scroll-mt-28 relative overflow-hidden py-20 md:py-28 text-white"
      style={{ background: "linear-gradient(160deg, #0F1A3A 0%, #1B2D5E 50%, #0D1520 100%)" }}
    >
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
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden md:block absolute top-8 left-full w-8 h-px overflow-hidden"
                >
                  <div
                    className="h-full w-full origin-left"
                    style={{
                      background: "linear-gradient(to right, rgba(245,166,35,0.5), rgba(245,166,35,0.1))",
                      animation: "connector-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
                      animationDelay: `${0.3 + i * 0.15}s`,
                    }}
                  />
                </div>
              )}

              <div className="text-7xl font-extrabold text-white/[0.07] mb-4 tabular-nums leading-none">
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

        {/* Inline mini chat preview */}
        <ScrollReveal delay={2} className="mt-16 mx-auto max-w-xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <div className="h-2 w-2 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium text-white/60">Sarokar Assistant</span>
            </div>
            <div className="p-4 space-y-3">
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-[#F5A623] px-4 py-2.5 text-xs font-medium text-white max-w-[75%]">
                  Passport renew garnu cha, ke ke chahinchha?
                </div>
              </div>
              {/* AI response */}
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-2.5 text-xs text-white/80 leading-relaxed max-w-[85%]">
                  Passport renewal ko lagi chahine documents: <br />
                  <span className="text-[#F5A623]">✓</span> Old Passport &nbsp;
                  <span className="text-[#F5A623]">✓</span> Citizenship &nbsp;
                  <span className="text-[#F5A623]">✓</span> 2 photos<br />
                  <span className="text-white/50 text-[11px]">Tripureshwor Department of Passport — 9:30am–4pm</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
