import Link from "next/link";

export default function KChaTaFooter() {
  return (
    <footer className="border-t border-kct-border bg-foreground text-background">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-12 md:py-16">
        <div className="md:grid md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="mb-10 md:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-extrabold tracking-tight">K Cha Ta?</span>
              <span className="text-sm text-background/40">by Sarokar</span>
            </div>
            <p className="text-sm text-background/50 leading-relaxed max-w-xs">
              Understand what&apos;s happening around you. Nepal ko internet culture, trends, and real conversations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-background/40 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Trending", href: "/k-cha-ta#trending" },
                { label: "Explain This", href: "/k-cha-ta#explain-this" },
                { label: "Verify Claims", href: "/k-cha-ta#verify" },
                { label: "Daily Drop", href: "/k-cha-ta#daily-drop" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/50 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sarokar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-background/40 mb-4">
              Sarokar
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/#services" },
                { label: "Government", href: "/chat?q=government" },
                { label: "How it works", href: "/#how-it-works" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/50 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-xs text-background/30">
            Independent information service. Not affiliated with the Government of Nepal. Demo content shown for illustration.
          </p>
        </div>
      </div>
    </footer>
  );
}
