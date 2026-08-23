import ScrollReveal from "@/components/shared/ScrollReveal";
import HimalayaRidge from "@/components/brand/HimalayaRidge";

function lastCheckedLabel() {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
}

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-dark text-white">
      <HimalayaRidge className="h-20 md:h-28 text-white" />
      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-2 md:gap-16 items-center">
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

          <div className="mt-10 md:mt-0 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-white/80">Official source</span>
              </div>
              <p className="text-sm text-dark-muted">
                Government of Nepal — Department of Passport
              </p>
              <p className="text-xs text-dark-muted mt-1">
                Last checked: {lastCheckedLabel()}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-white/80">Verified process</span>
              </div>
              <p className="text-sm text-dark-muted">
                Steps, documents, and fees cross-referenced with official guidelines.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-white/80">Honest about limits</span>
              </div>
              <p className="text-sm text-dark-muted">
                If we&apos;re not sure, we&apos;ll tell you and point you to the official source.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
