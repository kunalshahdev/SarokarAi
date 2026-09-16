import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";

const categories = [
  {
    id: "government",
    title: "Government",
    description: "Citizenship, national ID, passport and more.",
    badge: "15+ services",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    span: "sm:col-span-2 md:col-span-2 md:row-span-2",
    cardStyle: "bg-gradient-to-br from-[#1B2D5E]/8 to-[#1B2D5E]/3 border-[#1B2D5E]/15",
    iconColor: "text-[#1B2D5E]",
    accentColor: "text-[#1B2D5E]",
    link: "/chat?q=citizenship+nikalnu+cha",
  },
  {
    id: "documents",
    title: "Documents",
    description: "PAN, citizenship, police clearance.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    span: "md:col-span-1 md:row-span-1",
    cardStyle: "bg-gradient-to-br from-blue-50/80 to-blue-50/30 border-blue-100 dark:from-blue-950/20 dark:to-blue-950/10 dark:border-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentColor: "text-blue-600 dark:text-blue-400",
    link: "/chat?q=PAN+banaunu+cha",
  },
  {
    id: "transport",
    title: "Transport",
    description: "Driving licence, bluebook, renewals.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    span: "md:col-span-1 md:row-span-1",
    cardStyle: "bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 border-emerald-100 dark:from-emerald-950/20 dark:to-emerald-950/10 dark:border-emerald-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    link: "/chat?q=driving+licence+ko+next+step",
  },
  {
    id: "business",
    title: "Business",
    description: "Registration, PAN, tax and compliance.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    span: "md:col-span-1 md:row-span-1",
    cardStyle: "bg-gradient-to-br from-amber-50/80 to-amber-50/30 border-amber-100 dark:from-amber-950/20 dark:to-amber-950/10 dark:border-amber-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    accentColor: "text-amber-600 dark:text-amber-400",
    link: "/chat?q=company+register+garna+kati+lagcha",
  },
  {
    id: "education",
    title: "Education",
    description: "TU transcripts, certificates, equivalency.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    span: "md:col-span-1 md:row-span-1",
    cardStyle: "bg-gradient-to-br from-purple-50/80 to-purple-50/30 border-purple-100 dark:from-purple-950/20 dark:to-purple-950/10 dark:border-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    accentColor: "text-purple-600 dark:text-purple-400",
    link: "/chat?q=TU+transcript+kasari+nikalne",
  },
];

export default function CategoryGrid() {
  return (
    <section id="services" className="scroll-mt-24 md:scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <ScrollReveal className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight leading-tight">
            Whatever you need to figure out.
          </h2>
          <p className="mt-3 text-lg text-muted">
            From government paperwork to everyday life in Nepal.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 auto-rows-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className={`group ${cat.span} ${cat.cardStyle} rounded-2xl border p-6 md:p-8 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className={`${cat.iconColor} transition-colors duration-200`}>
                  {cat.icon}
                </div>
                {cat.badge && (
                  <span className="text-[10px] font-bold text-[#1B2D5E] bg-[#1B2D5E]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{cat.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                {cat.description}
              </p>
              <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${cat.accentColor} opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5`}>
                Explore
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
