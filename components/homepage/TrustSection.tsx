import ScrollReveal from "@/components/shared/ScrollReveal";
import HimalayaRidge from "@/components/brand/HimalayaRidge";

function lastCheckedLabel() {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
}

const trustCards = [
  {
    icon: (
      <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Official source",
    body: "Government of Nepal — Department of Passport",
    sub: (
      <a
        href="https://passport.gov.np"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[#F5A623] hover:underline mt-1 inline-block"
      >
        passport.gov.np ↗
      </a>
    ),
  },
  {
    icon: (
      <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Verified process",
    body: "Steps, documents, and fees cross-referenced across 12 government departments.",
    sub: (
      <p className="text-xs text-dark-muted mt-1">Last checked: {lastCheckedLabel()}</p>
    ),
  },
  {
    icon: (
      <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Honest about limits",
    body: "If we're not sure, we'll tell you and point you to the official source.",
    sub: null,
  },
  {
    icon: <span className="text-base">🇳🇵</span>,
    label: "Built in Nepal",
    body: "Made in Kathmandu by a team that navigates these same processes.",
    sub: (
      <p className="text-xs text-dark-muted mt-1">For Nepalis at home and worldwide</p>
    ),
  },
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-dark text-white">
      <HimalayaRidge className="h-20 md:h-28 text-white" />
      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-16 items-start">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              We don&apos;t guess
              <br />
              when it matters.
            </h2>
            <p className="mt-4 text-lg text-dark-muted leading-relaxed">
              Government requirements can change. Whenever possible, we connect guidance to authoritative sources so you can verify the information yourself.
            </p>
          </ScrollReveal>

          <div className="mt-10 md:mt-0 grid grid-cols-1 gap-4">
            {trustCards.map((card, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-200 hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <span className="text-sm font-medium text-white/80">{card.label}</span>
                </div>
                <p className="text-sm text-dark-muted">{card.body}</p>
                {card.sub}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
