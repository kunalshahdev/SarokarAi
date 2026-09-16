"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../brand/Logo";
import NepalFlag from "@/components/brand/NepalFlag";
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
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  diaspora: [
    { label: "Passport renewal", href: "/chat?q=passport+renewal" },
    { label: "Power of attorney", href: "/chat?q=power+of+attorney" },
    { label: "NRNA card", href: "/chat?q=nrna+card" },
    { label: "Remittance & tax", href: "/chat?q=remittance" },
  ],
};

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://twitter.com/sarokarapp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/sarokarapp",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/sarokarapp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail("");
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  return (
    <footer className="border-t border-border bg-dark text-white relative">
      <BackToTop />

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[#1B2D5E] border border-[#F5A623]/30 px-5 py-3 text-sm font-medium text-white shadow-lg animate-fade-up">
          🇳🇵 Subscribed! We&apos;ll keep you updated.
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-20">
        <div className="md:grid md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="mb-10 md:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo className="h-10 w-10" />
              <span className="text-lg font-bold tracking-tight">Sarokar</span>
            </div>

            {/* Devanagari tagline */}
            <p className="font-devanagari text-base text-white/40 mb-3">
              सरोकार — नेपालीको लागि
            </p>
            <p className="text-sm text-dark-muted leading-relaxed max-w-xs">
              Smart guidance, Nepali roots. Making everyday processes easier to understand — at home and across the world.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-dark-muted transition-all hover:border-[#F5A623]/40 hover:text-[#F5A623]"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <form onSubmit={handleNewsletter} className="mt-6">
              <p className="text-xs text-dark-muted mb-2 uppercase tracking-wider font-semibold">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white placeholder-white/30 focus:border-[#F5A623]/40 focus:outline-none focus:ring-1 focus:ring-[#F5A623]/20 transition-all"
                />
                <button
                  type="submit"
                  className="h-9 rounded-lg bg-[#F5A623] px-3 text-xs font-semibold text-white transition-all hover:bg-[#E8920D] active:scale-[0.97]"
                >
                  Join
                </button>
              </div>
            </form>

            {/* Made in Nepal */}
            <p className="mt-6 flex items-center gap-2 text-xs text-dark-muted">
              <span>Made in Kathmandu</span>
              <NepalFlag className="h-3.5 w-3.5" />
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

        {/* Nepal divider */}
        <div className="mt-16 divider-nepal" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-dark-muted">
            Independent information service. Not affiliated with the Government of Nepal.
          </p>
          <div className="flex items-center gap-5 text-xs text-dark-muted">
            <span>© {new Date().getFullYear()} Sarokar</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
