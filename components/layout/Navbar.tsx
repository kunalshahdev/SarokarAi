"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../brand/Logo";
import NepalFlag from "@/components/brand/NepalFlag";

const DISMISS_KEY = "dismissed-announcement";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "K Cha Ta?", href: "/k-cha-ta", kct: true },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Explore", href: "/#explore" },
];

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getThemeSnapshot() {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getThemeServerSnapshot() {
  return false;
}

function subscribeAnnouncement(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAnnouncementSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DISMISS_KEY) === "1";
}

function getAnnouncementServerSnapshot() {
  return false;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementAnimating, setAnnouncementAnimating] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const announcementDismissed = useSyncExternalStore(
    subscribeAnnouncement,
    getAnnouncementSnapshot,
    getAnnouncementServerSnapshot
  );
  const pathname = usePathname();

  const isKctPage = pathname.startsWith("/k-cha-ta");

  const dismissAnnouncement = () => {
    setAnnouncementAnimating(true);
    setTimeout(() => {
      localStorage.setItem(DISMISS_KEY, "1");
      window.dispatchEvent(new Event("storage"));
    }, 350);
  };

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const toggleTheme = useCallback(() => {
    const next = !getThemeSnapshot();
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("storage"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKeyDown);
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerTop = announcementDismissed ? "top-0" : "top-9";
  const mobileMenuTop = announcementDismissed ? "top-[64px]" : "top-[100px]";

  return (
    <>
      {/* Announcement bar */}
      {!announcementDismissed && (
        <div
          className={`fixed top-0 left-0 right-0 z-[60] bg-[#1B2D5E] text-white ${
            announcementAnimating ? "announcement-dismissed" : ""
          }`}
        >
          <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-center gap-2 px-5 text-xs font-medium tracking-wide">
            <NepalFlag className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Built in Kathmandu · Smart guidance, Nepali roots — for 5M+ Nepalis worldwide</span>
            <span className="sm:hidden">Smart guidance, Nepali roots</span>
            <Link
              href="/#how-it-works"
              className="underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity ml-1"
            >
              Learn more
            </Link>
            <button
              onClick={dismissAnnouncement}
              aria-label="Dismiss announcement"
              className="ml-3 flex h-5 w-5 items-center justify-center rounded-full opacity-60 hover:opacity-100 hover:bg-white/20 transition-all"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <header
        className={`fixed ${headerTop} left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Logo className="h-10 w-10" />
            <span className="text-lg font-bold tracking-tight hidden sm:block">Sarokar</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors hover:text-foreground ${
                    link.kct
                      ? active
                        ? "text-[#F5A623]"
                        : "text-[#E8920D] hover:text-[#F5A623]"
                      : active
                        ? "text-foreground"
                        : "text-muted"
                  }`}
                >
                  {link.kct && <span className="mr-0.5">🔥</span>}
                  {link.label}
                  {active && (
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        link.kct ? "bg-[#F5A623]" : "bg-[#1B2D5E]"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-lg transition-colors hover:bg-surface"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? (
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {isKctPage ? (
              <Link
                href="/k-cha-ta/chat"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920D 100%)" }}
              >
                Ask K Cha Ta?
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/chat"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#1B2D5E] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f1a3a] active:scale-[0.98]"
              >
                Ask Assistant
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg transition-colors hover:bg-surface"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            className={`absolute ${mobileMenuTop} left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in`}
          >
            <nav className="flex flex-col px-5 py-6 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-surface ${
                      link.kct
                        ? "text-[#E8920D]"
                        : active
                          ? "text-foreground bg-surface/60"
                          : "text-foreground"
                    }`}
                  >
                    <span>
                      {link.kct && <span className="mr-1">🔥</span>}
                      {link.label}
                    </span>
                    {active && (
                      <span className={`h-1.5 w-1.5 rounded-full ${link.kct ? "bg-[#F5A623]" : "bg-[#1B2D5E]"}`} />
                    )}
                  </Link>
                );
              })}
              <div className="h-px bg-border my-2" />
              {isKctPage ? (
                <Link
                  href="/k-cha-ta/chat"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-white transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #F5A623 0%, #E8920D 100%)" }}
                >
                  Ask K Cha Ta?
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/chat"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#1B2D5E] px-4 py-3 text-base font-medium text-white transition-all active:scale-[0.98]"
                >
                  Ask Assistant
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
