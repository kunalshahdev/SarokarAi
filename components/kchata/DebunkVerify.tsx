"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const verificationLabels = [
  {
    id: "true",
    label: "LIKELY TRUE",
    icon: "🟢",
    desc: "Backed by official evidence or government notices",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  {
    id: "unclear",
    label: "UNCLEAR / DEVELOPING",
    icon: "🟡",
    desc: "Mixed signals, pending updates, or unconfirmed reports",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  {
    id: "false",
    label: "FALSE / MISLEADING",
    icon: "🔴",
    desc: "Contradicted by actual facts or official laws",
    color: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
  },
  {
    id: "unknown",
    label: "NOT ENOUGH INFO",
    icon: "⚪",
    desc: "Internet rumor without credible verification",
    color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
  },
];

const sampleRumors = [
  {
    topic: "VPN Ban Rumor",
    claim: "The government of Nepal is banning all VPNs across all ISPs",
  },
  {
    topic: "Currency Rumor",
    claim: "500 and 1000 Indian Rupee notes are now freely accepted everywhere in Nepal",
  },
  {
    topic: "Social Media Regulation",
    claim: "Social media apps without Nepal registration will be permanently shut down",
  },
  {
    topic: "Licence Renewal",
    claim: "You can now renew your driving licence 100% online without any physical biometric visit",
  },
];

export default function DebunkVerify() {
  const router = useRouter();
  const [claim, setClaim] = useState("");

  const handleVerify = (textToVerify?: string) => {
    const target = textToVerify || claim;
    if (!target.trim()) return;
    router.push(
      `/k-cha-ta/chat?q=${encodeURIComponent(`Verify this: "${target.trim()}"`)}`
    );
  };

  const handleSelectSample = (sampleText: string) => {
    setClaim(sampleText);
  };

  return (
    <section id="verify" className="scroll-mt-24 md:scroll-mt-28 py-16 md:py-24 border-t border-kct-border bg-kct-surface/30">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="md:grid md:grid-cols-[1fr_1.25fr] md:gap-14 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="mb-10 md:mb-0 md:sticky md:top-24 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-kct-accent/30 bg-kct-accent/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-kct-accent mb-4">
                <span>🛡️ Fact Check &amp; Debunk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight leading-[1.12] text-foreground">
                Suneko kura ho ki sachchai?
              </h2>
              <p className="mt-3 text-base sm:text-lg text-kct-muted leading-relaxed">
                Heard a rumor on TikTok, Facebook, or group chats? Paste it here and we&apos;ll check what&apos;s actually confirmed vs internet noise.
              </p>
            </div>

            {/* Verification Standard Badges */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-kct-muted-light">
                Our Verification Standards:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {verificationLabels.map((label) => (
                  <div
                    key={label.id}
                    className={`flex items-start gap-2 rounded-xl border p-2.5 text-left transition-all ${label.color}`}
                  >
                    <span className="text-sm shrink-0 mt-0.5">{label.icon}</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{label.label}</p>
                      <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{label.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Claim Input Box */}
          <div className="rounded-2xl border-2 border-kct-border bg-kct-card p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-foreground">
                Paste or describe the claim:
              </label>
              {claim && (
                <button
                  type="button"
                  onClick={() => setClaim("")}
                  className="text-xs font-medium text-kct-muted hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && claim.trim()) {
                  e.preventDefault();
                  handleVerify();
                }
              }}
              placeholder='e.g. "The government is banning all VPNs in Nepal"'
              rows={4}
              className="w-full rounded-xl border-2 border-kct-border bg-kct-surface px-4 py-3.5 text-base font-medium text-foreground placeholder:text-kct-muted-light resize-none transition-all duration-200 focus:border-kct-accent focus:bg-kct-card focus:outline-none focus:ring-0"
            />

            {/* Quick Sample Rumors */}
            <div className="mt-4 pt-3 border-t border-kct-border/60">
              <p className="text-xs font-bold text-kct-muted mb-2 flex items-center gap-1.5">
                <span>🔥</span> Try verifying these viral claims:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleRumors.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-stretch overflow-hidden rounded-lg border border-kct-border bg-kct-surface transition-all focus-within:border-kct-accent/50 hover:border-kct-accent/50"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSample(item.claim)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-kct-muted hover:text-foreground transition-all text-left"
                    >
                      <span>&bull;</span>
                      <span>{item.topic}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerify(item.claim)}
                      aria-label={`Verify "${item.topic}" directly`}
                      title="Verify directly"
                      className="inline-flex items-center border-l border-kct-border px-2.5 text-kct-muted-light hover:text-kct-accent hover:bg-kct-accent-light transition-all"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={!claim.trim()}
                aria-disabled={!claim.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 text-base font-bold text-white transition-all hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:opacity-40"
              >
                {claim.trim() ? (
                  <>
                    <span>Verify this Claim with AI</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                ) : (
                  <span>Type a claim or choose a rumor above to verify</span>
                )}
              </button>
            </div>

            <p className="mt-3.5 text-xs text-kct-muted-light text-center leading-relaxed">
              We check against official government gazettes, ministry directives, and verified Nepali reporting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
