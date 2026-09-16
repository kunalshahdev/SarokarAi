"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface DrawerTopic {
  id: string;
  title: string;
  source?: string;
  time?: string;
  url?: string;
}

interface SummaryResponse {
  tldr: string;
  keyPoints: string[];
  whyItMatters: string;
}

const loadingHints = [
  "Pura article padhdai chu\u2026",
  "Facts ra noise chhutyaudai\u2026",
  "Summary banaudai chu\u2026",
];

export default function NewsDrawer({
  topic,
  onClose,
}: {
  topic: DrawerTopic;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hintIdx, setHintIdx] = useState(0);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/kcha/news/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: topic.id, url: topic.url, title: topic.title }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.summary) setSummary(data.summary);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [topic]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(
      () => setHintIdx((i) => (i + 1) % loadingHints.length),
      1800
    );
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const askMore = (question?: string) => {
    const q = (question || followUp).trim() || `Explain this story: ${topic.title}`;
    const params = new URLSearchParams({ q });
    if (topic.url) params.set("aboutUrl", topic.url);
    if (topic.title) params.set("aboutTitle", topic.title);
    if (topic.id) params.set("about", topic.id);
    router.push(`/k-cha-ta/chat?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={`News: ${topic.title}`}>
      <button
        aria-label="Close news panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm animate-fade-up cursor-default"
      />
      <aside className="absolute right-0 bottom-0 sm:top-0 h-[88vh] sm:h-full w-full sm:w-[440px] rounded-t-3xl sm:rounded-none bg-kct-surface border-t sm:border-t-0 sm:border-l border-kct-border shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-kct-border bg-kct-card/60 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {topic.source && (
                <p className="text-[11px] font-bold uppercase tracking-wider text-kct-muted">
                  {topic.source}
                  {topic.time ? ` · ${topic.time}` : ""}
                </p>
              )}
              <h3 className="mt-1 text-base font-bold leading-snug text-foreground line-clamp-3">
                {topic.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 h-8 w-8 -mt-0.5 -mr-1 flex items-center justify-center rounded-lg text-kct-muted hover:bg-kct-surface hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {loading && (
            <div aria-live="polite" aria-busy="true">
              <p className="text-xs font-bold uppercase tracking-wider text-kct-accent animate-pulse mb-4">
                👀 {loadingHints[hintIdx]}
              </p>
              <div className="space-y-2.5">
                {[100, 92, 96, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-3.5 rounded bg-kct-border/70 animate-pulse"
                    style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && failed && (
            <div className="rounded-xl border border-kct-border bg-kct-card p-4 text-center space-y-3">
              <p className="text-sm text-kct-muted leading-relaxed">
                AI summary yo story ko lagi ahile banauna sakena.
              </p>
              <button
                onClick={() => askMore(`Explain this story: ${topic.title}`)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-white hover:opacity-95 active:scale-[0.97]"
              >
                AI sanga direct sodha
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}

          {!loading && summary && (
            <>
              <section aria-label="Summary">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-kct-accent mb-2">
                  K bhayo?
                </h4>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {summary.tldr}
                </p>
              </section>

              {summary.keyPoints.length > 0 && (
                <section aria-label="Key points">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-kct-accent mb-2">
                    Main kura haru
                  </h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-foreground leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kct-accent/60" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {summary.whyItMatters && (
                <section
                  aria-label="Why it matters"
                  className="rounded-xl border border-kct-accent/20 bg-kct-accent-light p-4"
                >
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-kct-accent mb-1.5">
                    Kina important?
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground">
                    {summary.whyItMatters}
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-kct-border bg-kct-card/80 backdrop-blur px-5 py-4 space-y-3">
          {topic.url && topic.url.startsWith("http") && (
            <a
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-kct-muted hover:text-foreground transition-colors"
            >
              {topic.source || "source"} ma original padha
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askMore();
            }}
            className="relative flex items-center"
          >
            <input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Yo story barema aru sodha…"
              className="h-11 w-full rounded-xl border border-kct-border bg-kct-card pl-4 pr-14 text-sm text-foreground placeholder:text-kct-muted-light focus:border-kct-accent focus:outline-none focus:ring-4 focus:ring-kct-accent/10 transition-all"
            />
            <button
              type="submit"
              aria-label="Continue in chat"
              className="absolute right-1.5 h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center hover:opacity-95 active:scale-95 transition-all"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
          <p className="text-[10px] text-kct-muted-light text-center">
            Yehi story ko context sanga chat continue huncha
          </p>
        </div>
      </aside>
    </div>
  );
}
