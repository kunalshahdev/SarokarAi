import Link from "next/link";
import Logo from "../brand/Logo";
import BackToTop from "./BackToTop";

const footerLinks = {
  explore: [
    { label: "Services", href: "/#services" },
    { label: "K Cha Ta?", href: "/k-cha-ta" },
    { label: "Government", href: "/chat?q=government" },
    { label: "Business", href: "/chat?q=company+register" },
    { label: "Transport", href: "/chat?q=driving+licence" },
  ],
  company: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  diaspora: [
    { label: "Passport renewal", href: "/chat?q=passport+renewal" },
    { label: "Power of attorney", href: "/chat?q=power+of+attorney" },
    { label: "NRNA card", href: "/chat?q=nrna+card" },
    { label: "Remittance & tax", href: "/chat?q=remittance" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-dark text-white">
      <BackToTop />
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-20">
        <div className="md:grid md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="mb-10 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-10 w-10" />
              <span className="text-lg font-bold tracking-tight">Sarokar</span>
            </div>
            <p className="text-sm text-dark-muted leading-relaxed max-w-xs">
              Making everyday processes in Nepal easier to understand — for Nepalis at home and across the world.
            </p>

            {/* Made in Nepal */}
            <p className="mt-6 flex items-center gap-2 text-xs text-dark-muted">
              <span>Made in Kathmandu</span>
              <span aria-hidden>🇳🇵</span>
              <span>for Nepalis everywhere</span>
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-dark-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Nepalis abroad */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              For Nepalis Abroad
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.diaspora.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-dark-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-dark-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Language */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                Language
              </h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-white font-medium">English</span>
                </li>
                <li>
                  <span className="text-sm text-dark-muted/50 font-devanagari cursor-not-allowed" title="Coming soon">
                    नेपाली <span className="text-[10px] align-super">(soon)</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-dark-muted">
            Independent information service. Not affiliated with the Government of Nepal.
          </p>
          <div className="flex items-center gap-5 text-xs text-dark-muted">
            <span>© {new Date().getFullYear()} Sarokar</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse-dot" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
