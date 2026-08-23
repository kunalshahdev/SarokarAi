"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const popularLinks = [
  { label: "Passport", query: "passport renew garnu cha" },
  { label: "PAN card", query: "PAN banaunu cha" },
  { label: "Driving licence", query: "driving licence ko next step" },
  { label: "Citizenship", query: "citizenship nikalnu cha" },
];

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
      <div className="mb-6 text-6xl">🔍</div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        404
      </h1>
      <p className="mt-3 text-lg text-muted max-w-md">
        Yo page ta chaina. Tara je sodhnu cha, sodhna sakchau.
      </p>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
        }}
        className="mt-8 w-full max-w-md"
      >
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "mero passport renew garnu cha"'
            className="h-13 py-3.5 w-full rounded-xl border border-border bg-card pl-11 pr-24 text-sm shadow-sm transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-30 active:scale-[0.97]"
          >
            Ask
          </button>
        </div>
      </form>

      {/* Popular links */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-light">Popular:</span>
        {popularLinks.map((l) => (
          <Link
            key={l.label}
            href={`/chat?q=${encodeURIComponent(l.query)}`}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted transition-all hover:border-accent/30 hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Ghar jau
      </Link>
    </div>
  );
}
