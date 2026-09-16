import Link from "next/link";

const terms = [
  { label: "Ward", query: "ward office Nepal" },
  { label: "DAO", query: "DAO district administration office" },
  { label: "IRD", query: "IRD inland revenue department" },
  { label: "PAN", query: "PAN banaunu cha" },
  { label: "NID", query: "national ID card Nepal" },
  { label: "Yatayat", query: "yatayat transport office" },
  { label: "Bluebook", query: "bluebook renew garna cha" },
  { label: "TU", query: "TU Tribhuvan University" },
  { label: "Loksewa", query: "loksewa public service commission" },
  { label: "Malpot", query: "malpot land registration" },
  { label: "Rajaswa", query: "rajaswa revenue office" },
  { label: "Nagarpalika", query: "nagarpalika municipality" },
];

export default function NepalSection() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-[1.2fr_1fr] md:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              Built around how
              <br />
              Nepal actually works.
            </h2>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Government websites can tell you what a process is. We help you understand what to actually do.
            </p>
          </div>

          <div className="mt-10 md:mt-0 flex flex-wrap gap-2.5">
            {terms.map((term) => (
              <Link
                key={term.label}
                href={`/chat?q=${encodeURIComponent(term.query)}`}
                className="min-h-11 inline-flex items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-all hover:border-accent/30 hover:bg-accent-light hover:shadow-sm active:scale-[0.97]"
              >
                {term.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
