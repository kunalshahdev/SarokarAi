"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import SavedDrawer from "@/components/shared/SavedDrawer";
import KChaTaEyes from "@/components/brand/KChaTaEyes";
import NepalFlag from "@/components/brand/NepalFlag";
import { toast } from "@/components/shared/toast";

type Mode = "explain" | "chill" | "tldr" | "nepali" | "roman" | "deep";

const modes = [
  { id: "explain" as Mode, label: "Explain", icon: "\uD83E\uDDE0" },
  { id: "chill" as Mode, label: "Chill", icon: "\uD83D\uDE02" },
  { id: "tldr" as Mode, label: "TL;DR", icon: "\u26A1" },
  { id: "nepali" as Mode, label: "Nepali", icon: <NepalFlag className="h-3 w-3" /> },
  { id: "roman" as Mode, label: "Roman Nepali", icon: "\u2328\uFE0F" },
  { id: "deep" as Mode, label: "Deep Dive", icon: "\uD83E\uDD0D" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  mode?: Mode;
  error?: boolean;
  sources?: GroundedSource[];
}

interface GroundedSource {
  n: number;
  title: string;
  source: string;
  url: string;
  time: string;
}

function SourcesChip({ sources }: { sources: GroundedSource[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-kct-border bg-kct-card px-2.5 py-1 text-[11px] font-bold text-kct-muted transition-all hover:border-kct-accent/40 hover:text-foreground"
      >
        <svg className="h-3 w-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Grounded in {sources.length} live source{sources.length > 1 ? "s" : ""}
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <ol className="mt-2 space-y-1.5 rounded-xl border border-kct-border bg-kct-card p-3">
          {sources.map((s) => (
            <li key={s.n} className="text-xs leading-snug text-foreground">
              <span className="font-bold text-kct-accent">[{s.n}]</span>{" "}
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-kct-border underline-offset-2 hover:decoration-kct-accent transition-colors"
                >
                  {s.title}
                </a>
              ) : (
                s.title
              )}
              <span className="text-kct-muted-light">
                {" "}
                &middot; {s.source} &middot; {s.time}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const loadingMessages = [
  "Context gather gardai\u2026",
  "Checking what's actually known\u2026",
  "Separating facts from internet noise\u2026",
  "Trending data herdai\u2026",
  "Wait gar\u2026 almost there\u2026",
];

const suggestions = [
  "Yo trend k ho?",
  "Why is everyone talking about this?",
  "Explain this in normal Nepali",
  "Roman Nepali ma bujhaideu",
  "Is this actually true?",
  "Give me the no bakwas version",
];

function KChaTaChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || undefined;
  const initialMode = (searchParams.get("mode") as Mode) || undefined;
  const aboutArticleId = searchParams.get("about") || undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode || "explain");
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);
  const [savedOpen, setSavedOpen] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoSent = useRef(false);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Auto-focus input on mount
  useEffect(() => {
    if (!initialQuery) {
      inputRef.current?.focus();
    }
  }, [initialQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setInput("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const streamingRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      let idx = 0;
      const interval = setInterval(() => {
        idx = (idx + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[idx]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const sendMessage = async (text: string) => {
    if (!text || isLoading || streamingRef.current) return;

    streamingRef.current = true;
    const userMessage: Message = { role: "user", content: text };
    setInput("");
    setIsLoading(true);

    // Add user + placeholder assistant
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "", mode }]);

    try {
      const response = await fetch("/api/kcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          articleId: aboutArticleId,
        }),
      });

      if (!response.ok) {
        const serverMessage = await response
          .json()
          .then((data) => data?.error)
          .catch(() => null);
        throw new Error(
          typeof serverMessage === "string" && serverMessage
            ? serverMessage
            : "AI service ahile busy cha. Ekchin pachi feri try garnuhos."
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let streamedText = "";
      let pendingSources: GroundedSource[] | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (Array.isArray(parsed.sources)) {
              pendingSources = parsed.sources;
            } else if (parsed.text) {
              streamedText += parsed.text;
              setMessages((prev) => {
                if (prev.length === 0) return prev;
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                  ...updated[lastIdx],
                  role: "assistant",
                  content: streamedText,
                  mode,
                };
                return updated;
              });
            }
          } catch {}
        }
      }

      if (!streamedText) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { role: "assistant", content: "Hmm, something went wrong. Try again?", mode, error: true };
          return updated;
        });
      } else if (pendingSources && pendingSources.length > 0) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], sources: pendingSources! };
          return updated;
        });
      }
    } catch (err) {
      const friendly =
        err instanceof Error && err.message
          ? err.message
          : "Hmm, something went wrong. Try again?";
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        updated.push({ role: "assistant", content: friendly, mode, error: true });
        return updated;
      });
    } finally {
      streamingRef.current = false;
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (initialQuery && !hasAutoSent.current) {
      hasAutoSent.current = true;
      const timer = setTimeout(() => {
        sendMessage(initialQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const startNewChat = useCallback(() => {
    setMessages([]);
    setFeedback({});
    inputRef.current?.focus();
    toast("Started a new chat");
  }, []);

  const retryLast = useCallback(() => {
    const msgs = messagesRef.current;
    let lastUserIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    const question = msgs[lastUserIdx].content;
    const retryMode = msgs[msgs.length - 1]?.mode || mode;
    setMode(retryMode);
    setMessages(msgs.slice(0, lastUserIdx));
    setTimeout(() => sendMessage(question), 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({ title: "K Cha Ta? — Sarokar", text: content }).catch(() => {});
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(content + "\n\n— via K Cha Ta? on Sarokar")}`,
        "_blank",
        "noopener,noreferrer"
      );
      toast("Opening WhatsApp to share");
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-kct-surface">
      {/* Header */}
      <header className="shrink-0 border-b border-kct-border bg-kct-surface/80 backdrop-blur-xl supports-[backdrop-filter]:bg-kct-surface/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/k-cha-ta"
            className="flex items-center gap-2.5 text-sm font-medium text-kct-muted hover:text-foreground transition-colors duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="font-bold tracking-tight">K Cha Ta?</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 mr-1">
              <div className="h-2 w-2 rounded-full bg-kct-accent animate-pulse" />
              <span className="text-xs font-medium text-kct-muted-light">Online</span>
            </div>

            {messages.length > 0 && (
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 rounded-lg border border-kct-border bg-kct-card px-2.5 py-1 text-xs font-semibold text-kct-muted transition-all hover:border-kct-accent/30 hover:text-foreground active:scale-[0.97]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="hidden sm:inline">New chat</span>
              </button>
            )}

            <button
              onClick={() => setSavedOpen(true)}
              aria-label="View saved answers"
              className="flex items-center justify-center h-8 w-8 rounded-lg text-kct-muted transition-colors hover:bg-kct-card hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
              <div className="relative mb-6">
                <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-kct-accent/10 blur-2xl" />
                <div aria-hidden="true" className="absolute -inset-5 rounded-full bg-orange-400/10 blur-xl" />
                <KChaTaEyes className="relative h-20 w-20" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                K sodhne cha?
              </h2>
              <p className="mt-2 text-base text-kct-muted max-w-sm">
                Trending ho, career ho, tech ho &mdash; kehi pani sodhna sakchau.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-kct-muted-light">
                Nepal Internet Culture
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className={`rounded-xl border border-kct-border bg-kct-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-card transition-all duration-200 hover:border-kct-accent/30 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97] animate-fade-up stagger-${Math.min(i + 1, 8)}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "animate-slide-in-right" : "animate-slide-in-left"}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[82%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-foreground px-4 py-3 text-sm text-background leading-relaxed font-medium">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start gap-2.5 max-w-[90%]">
                    <div className="shrink-0 mt-0.5">
                      <div className="h-8 w-8 rounded-lg bg-kct-accent/10 ring-1 ring-kct-accent/20 flex items-center justify-center">
                        <KChaTaEyes className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-2 min-w-0">
                      <div className="rounded-2xl rounded-tl-md bg-kct-card border border-kct-border shadow-card px-4 py-3 text-sm leading-relaxed">
                        <MarkdownRenderer content={msg.content} variant="kchata" />
                      </div>
                      {i === messages.length - 1 && !isLoading && msg.sources && msg.sources.length > 0 && (
                        <SourcesChip sources={msg.sources} />
                      )}
                      {i === messages.length - 1 && !isLoading && (
                        <div className="mt-1">
                          {msg.error ? (
                            <button
                              onClick={retryLast}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-kct-accent/40 bg-kct-accent-light px-3 py-1.5 text-xs font-semibold text-kct-accent transition-all hover:border-kct-accent/70 active:scale-[0.97]"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                              Retry
                            </button>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(msg.content);
                                  toast("Copied to clipboard");
                                }}
                                className="text-xs font-semibold text-kct-muted hover:text-kct-accent transition-colors"
                              >
                                Copy
                              </button>
                              <span className="text-kct-border">|</span>
                              <button
                                onClick={() => shareMessage(msg.content)}
                                className="text-xs font-semibold text-kct-muted hover:text-kct-accent transition-colors"
                              >
                                Share
                              </button>
                              <span className="text-kct-border">|</span>
                              <button
                                onClick={() => {
                                  try {
                                    const saved = JSON.parse(localStorage.getItem("kct-saved") || "[]");
                                    saved.push({ content: msg.content, mode, date: new Date().toISOString() });
                                    if (saved.length > 50) saved.splice(0, saved.length - 50);
                                    localStorage.setItem("kct-saved", JSON.stringify(saved));
                                    toast("Saved to your bookmarks");
                                  } catch {}
                                }}
                                className="text-xs font-semibold text-kct-muted hover:text-kct-accent transition-colors"
                              >
                                Save
                              </button>
                              <span className="flex items-center gap-0.5 ml-auto rounded-full border border-kct-border bg-kct-card px-1 py-0.5">
                                <button
                                  onClick={() => setFeedback((p) => ({ ...p, [i]: "up" }))}
                                  aria-label="Helpful answer"
                                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all active:scale-90 ${
                                    feedback[i] === "up" ? "bg-teal-500/15 text-teal-600 dark:text-teal-400" : "text-kct-muted-light hover:text-foreground"
                                  }`}
                                >
                                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={feedback[i] === "up" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.25l-2.248 5.737a2.25 2.25 0 00-.13.709v2.25c0 .621.504 1.125 1.125 1.125h1.092a2.25 2.25 0 002.09-1.443l.63-1.632M6.633 10.25H3.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h1.5a2.25 2.25 0 002.25-2.25V12a1.75 1.75 0 00-.492-1.75z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setFeedback((p) => ({ ...p, [i]: "down" }))}
                                  aria-label="Not helpful"
                                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all active:scale-90 ${
                                    feedback[i] === "down" ? "bg-kct-accent/15 text-kct-accent" : "text-kct-muted-light hover:text-foreground"
                                  }`}
                                >
                                  <svg className="h-3.5 w-3.5 rotate-180" viewBox="0 0 24 24" fill={feedback[i] === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.25l-2.248 5.737a2.25 2.25 0 00-.13.709v2.25c0 .621.504 1.125 1.125 1.125h1.092a2.25 2.25 0 002.09-1.443l.63-1.632M6.633 10.25H3.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h1.5a2.25 2.25 0 002.25-2.25V12a1.75 1.75 0 00-.492-1.75z" />
                                  </svg>
                                </button>
                                {(feedback[i] === "up" || feedback[i] === "down") && (
                                  <span className="pr-1 text-[10px] font-medium text-kct-muted-light">Thanks!</span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-start gap-2.5 animate-slide-in-left mt-5">
              <div className="shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-kct-accent/10 ring-1 ring-kct-accent/20 flex items-center justify-center">
                  <KChaTaEyes className="h-5 w-5" />
                </div>
              </div>
              <div className="rounded-2xl rounded-tl-md bg-kct-card border border-kct-border shadow-card px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-kct-accent/40 animate-pulse-dot" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-kct-accent/40 animate-pulse-dot" style={{ animationDelay: "200ms" }} />
                    <span className="h-2 w-2 rounded-full bg-kct-accent/40 animate-pulse-dot" style={{ animationDelay: "400ms" }} />
                  </div>
                  <span className="text-xs text-kct-muted animate-pulse">{loadingMsg}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mode switcher */}
      <div className="shrink-0 border-t border-kct-border bg-kct-surface/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-2">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`
                  shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold
                  transition-all duration-150
                  ${
                    mode === m.id
                      ? "bg-foreground text-background"
                      : "text-kct-muted hover:text-foreground hover:bg-kct-card"
                  }
                `}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-kct-border bg-kct-surface/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="K cha ta? Ke ko barema kura garne?"
                disabled={isLoading}
                className="h-12 sm:h-14 flex-1 rounded-xl border border-kct-border bg-kct-card px-4 pr-28 text-sm sm:text-[15px] font-medium transition-all duration-200 focus:border-kct-accent focus:outline-none focus:ring-4 focus:ring-kct-accent/10 disabled:opacity-50 placeholder:text-kct-muted-light"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-3.5 sm:px-4 h-9 sm:h-10 text-sm font-semibold text-white transition-all duration-200 hover:opacity-95 disabled:opacity-30 active:scale-[0.95] flex items-center gap-1.5 shadow-sm"
              >
                <span className="hidden sm:inline">Sodh</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-kct-muted-light text-center sm:text-left">
              English, नेपाली, or Roman Nepali — ask in any language
            </p>
          </form>
        </div>
      </div>

      <SavedDrawer open={savedOpen} onClose={() => setSavedOpen(false)} />
    </div>
  );
}

export default function KChaTaChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh flex-col items-center justify-center bg-kct-surface gap-3">
          <div className="h-12 w-12 rounded-xl bg-kct-accent/10 ring-1 ring-kct-accent/20 flex items-center justify-center animate-pulse">
            <KChaTaEyes className="h-7 w-7" />
          </div>
          <div className="text-sm text-kct-muted font-semibold">Loading K Cha Ta?...</div>
        </div>
      }
    >
      <KChaTaChatContent />
    </Suspense>
  );
}
