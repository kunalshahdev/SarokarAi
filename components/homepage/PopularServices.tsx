import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";

const services = [
  {
    title: "Passport",
    description: "New, renewal, appointment — everything you need to know.",
    category: "Government",
    href: "/chat?q=passport+renew+garna+cha",
  },
  {
    title: "PAN",
    description: "Permanent Account Number — apply, renew, or update.",
    category: "Tax",
    href: "/chat?q=PAN+banaunu+cha",
  },
  {
    title: "Driving Licence",
    description: "Learner, trial, renewal, international permit.",
    category: "Transport",
    href: "/chat?q=driving+licence+ko+next+step",
  },
  {
    title: "National ID",
    description: "Apply, check status, biometric enrollment.",
    category: "Government",
    href: "/chat?q=national+ID+apply+garna+cha",
  },
  {
    title: "Police Clearance",
    description: "Required for abroad — application and process.",
    category: "Documents",
    href: "/chat?q=police+clearance+nikalnu+cha",
  },
  {
    title: "Bluebook",
    description: "Vehicle registration renewal and transfer.",
    category: "Transport",
    href: "/chat?q=bluebook+renew+garna+cha",
  },
];

export default function PopularServices() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <ScrollReveal className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
              Popular services.
            </h2>
            <p className="mt-3 text-lg text-muted">
              The things people ask about most.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-accent/20 hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
            >
              <p className="text-xs font-medium text-muted-light uppercase tracking-wider mb-2">
                {service.category}
              </p>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed flex-1">
                {service.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                Explore
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
