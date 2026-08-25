"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import NepalFlag from "@/components/brand/NepalFlag";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import SavedDrawer from "@/components/shared/SavedDrawer";
import { toast } from "@/components/shared/toast";

interface Step {
  title: string;
  description: string;
}

interface Office {
  name: string;
  address?: string;
  hours?: string;
  website?: string;
}

interface Source {
  name: string;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "steps" | "options" | "documents" | "office" | "source" | "error";
  steps?: Step[];
  options?: string[];
  documents?: string[];
  office?: Office;
  source?: Source;
}

const welcomeSuggestions = [
  "PAN banaunu cha",
  "Passport renew kasari garne?",
  "Driving licence ko next step?",
  "Bluebook renew garna cha",
];

const placeholders = [
  'Try "mero passport renew garnu cha"',
  'Try "PAN banauna k chaincha?"',
  'Try "driving licence kasari linchu?"',
  'Try "bluebook renew garna cha"',
  'Try "citizenship nikalnu cha"',
];

const quickTopicPills = [
  { label: "Passport", query: "Passport renew kasari garne?", icon: <NepalFlag className="h-3 w-3" /> },
  { label: "Driving Licence", query: "Driving licence ko next step k ho?", icon: "🚘" },
  { label: "PAN Card", query: "PAN card banauna k k chaincha?", icon: "📑" },
  { label: "National ID", query: "National ID card apply kasari garne?", icon: "🏛️" },
  { label: "Lok Sewa", query: "Lok Sewa tayari ra online application process k ho?", icon: "📚" },
  { label: "Labor Permit", query: "Shram swikriti online kasari line?", icon: "🧳" },
  { label: "TU Transcript", query: "TU transcript nikalna k k documents chaincha?", icon: "📜" },
  { label: "Birth & Marriage", query: "Janma ra vivaha darta ward office ma kasari garne?", icon: "💍" },
  { label: "Company Register", query: "Company registration Nepal ma kasari garne?", icon: "🏢" },
  { label: "Bluebook Renewal", query: "Bluebook renew garna k chaincha?", icon: "📋" },
];

const STORAGE_KEY = "sarokar-chat-messages";

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m: unknown): m is Message =>
        typeof m === "object" &&
        m !== null &&
        "role" in m &&
        "content" in m &&
        typeof (m as Message).content === "string" &&
        ((m as Message).role === "user" || (m as Message).role === "assistant")
    );
  } catch {
    return [];
  }
}

export default function ChatInterface({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState(initialQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [initialQueryLoading, setInitialQueryLoading] = useState(() => !!initialQuery && loadMessages().length === 0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showWelcome, setShowWelcome] = useState(() => loadMessages().length === 0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoSent = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const streamingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = useCallback((instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // On initial mount: if there are persisted messages, scroll to bottom instantly
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const sendMessage = async (text: string) => {
    if (!text || isLoading || streamingRef.current) return;

    setShowWelcome(false);
    const userMessage: Message = { role: "user", content: text };
    setInput("");
    setIsLoading(true);
    streamingRef.current = true;
    setIsStreaming(true);

    // Add user + placeholder assistant
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesRef.current, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
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
      let topicMeta: Record<string, unknown> | null = null;

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
            if (parsed.topicMeta) {
              topicMeta = parsed.topicMeta;
            } else if (parsed.error) {
              throw new Error(parsed.error);
            } else if (parsed.text) {
              streamedText += parsed.text;
              // Update the streaming message in place (always target last message)
              setMessages((prev) => {
                if (prev.length === 0) return prev;
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                  ...updated[lastIdx],
                  role: "assistant",
                  content: streamedText,
                };
                return updated;
              });
            }
          } catch {}
        }
      }

      // Finalize: attach topic data if available
      if (topicMeta) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            role: "assistant",
            content: streamedText,
            type: topicMeta.steps ? "steps" : "text",
            steps: topicMeta.steps as Step[] | undefined,
            documents: topicMeta.documents as string[] | undefined,
            office: topicMeta.office as Office | undefined,
            source: topicMeta.source as Source | undefined,
          };
          return updated;
        });
      } else if (!streamedText) {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            role: "assistant",
            content: "Sorry, the AI could not generate a response. Please try rephrasing.",
            type: "text",
          };
          return updated;
        });
      }
    } catch (err) {
      const friendly =
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Your question didn't go through.";
      setMessages((prev) => {
        // Replace the empty placeholder with a retryable error message
        const updated = prev.slice(0, -1);
        updated.push({
          role: "assistant",
          content: friendly,
          type: "error",
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
      streamingRef.current = false;
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (initialQuery && !hasAutoSent.current) {
      hasAutoSent.current = true;
      const timer = setTimeout(() => {
        setInitialQueryLoading(false);
        sendMessage(initialQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;
    await sendMessage(message);
  };

  const startNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    setCheckedDocs({});
    setFeedback({});
    sessionStorage.removeItem(STORAGE_KEY);
    inputRef.current?.focus();
    toast("Started a new chat");
  }, []);

  const retryLast = useCallback(() => {
    // Find the last user question and resend it, dropping the error reply
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
    setMessages(msgs.slice(0, lastUserIdx));
    setTimeout(() => sendMessage(question), 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDocCheck = (msgIdx: number, docIdx: number) => {
    const key = `${msgIdx}-${docIdx}`;
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({ title: "Sarokar", text: content }).catch(() => {});
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(content + "\n\n— via Sarokar")}`,
        "_blank",
        "noopener,noreferrer"
      );
      toast("Opening WhatsApp to share");
    }
  };

  const handlePillClick = (query: string) => {
    handleSend(query);
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Initial query shimmer overlay */}
      {initialQueryLoading && (
        <div className="absolute inset-0 z-10 flex flex-col bg-chat-bg">
          <div className="shrink-0 border-b border-border h-14 flex items-center px-4">
            <div className="h-4 w-20 rounded bg-border animate-shimmer" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4 gap-4">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 animate-pulse" />
            <div className="h-5 w-48 rounded bg-border animate-shimmer" />
            <div className="h-4 w-64 rounded bg-border/60 animate-shimmer" />
            <div className="mt-2 flex flex-col gap-2 w-full max-w-xl">
              <div className="h-14 rounded-2xl bg-card border border-border shadow-card overflow-hidden relative">
                <div className="absolute inset-0 animate-shimmer" style={{ background: "linear-gradient(90deg, transparent 25%, var(--color-border) 50%, transparent 75%)", backgroundSize: "200% 100%" }} />
              </div>
              {[80, 64, 72].map((w, i) => (
                <div key={i} className="h-12 rounded-2xl bg-chat-assistant border border-chat-assistant-border overflow-hidden relative" style={{ maxWidth: `${w}%` }}>
                  <div className="absolute inset-0 animate-shimmer" style={{ background: "linear-gradient(90deg, transparent 25%, var(--color-border) 50%, transparent 75%)", backgroundSize: "200% 100%", animationDelay: `${i * 150}ms` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-chat-header-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-chat-header-bg/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">Sarokar</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 mr-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-light">Online</span>
            </div>

            {messages.length > 0 && (
              <button
                onClick={startNewChat}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted transition-all hover:border-accent/30 hover:text-accent active:scale-[0.97]"
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
              className="flex items-center justify-center h-8 w-8 rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">

          {/* Welcome screen */}
          {showWelcome && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
              <div className="mb-6">
                <Logo className="h-20 w-20" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ke garnu cha?
              </h2>
              <p className="mt-2 text-base text-muted max-w-sm">
                Tell me what you&apos;re trying to get done, and I&apos;ll guide you through it.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md">
                {welcomeSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className={`rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/30 hover:bg-accent-light hover:shadow-sm active:scale-[0.97] animate-fade-up stagger-${i + 1}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "animate-slide-in-right" : "animate-slide-in-left"}>
                {msg.role === "user" ? (
                  /* User message */
                  <div className="flex justify-end">
                    <div className="max-w-[82%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-chat-user px-4 py-3 text-sm text-chat-user-text leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : !(i === messages.length - 1 && isLoading && !msg.content) && (
                  /* Assistant message — hidden entirely while waiting for the first token */
                  <div className="flex justify-start gap-2.5 max-w-[90%]">
                    {/* Avatar */}
                    <div className="shrink-0 mt-0.5">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Logo className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-2.5 min-w-0">
                      {/* Main text */}
                      <div className="rounded-2xl rounded-tl-md bg-chat-assistant border border-chat-assistant-border px-4 py-3 text-sm leading-relaxed">
                        <MarkdownRenderer content={msg.content} />
                        {i === messages.length - 1 && isLoading && isStreaming && msg.content && (
                          <span className="inline-block w-1.5 h-4 bg-accent/40 animate-pulse ml-0.5 align-text-bottom" />
                        )}
                      </div>

                      {/* Steps card */}
                      {Array.isArray(msg.steps) && msg.steps.length > 0 && (
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-border bg-surface/50">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Process steps</p>
                          </div>
                          <div className="p-4">
                            <div className="relative">
                              <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
                              <div className="space-y-4">
                                {msg.steps.map((step, j) => (
                                  <div key={j} className="relative flex gap-3 group">
                                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white ring-4 ring-card">
                                      {j + 1}
                                    </div>
                                    <div className="pt-0.5">
                                      <div className="text-sm font-medium text-foreground">{step.title}</div>
                                      <div className="mt-0.5 text-xs text-muted leading-relaxed">{step.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Documents card */}
                      {Array.isArray(msg.documents) && msg.documents.length > 0 && (
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-border bg-surface/50 flex items-center justify-between">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Documents needed</p>
                            <span className="text-[10px] text-muted-light">Tap to check off</span>
                          </div>
                          <div className="p-4">
                            <div className="space-y-2.5">
                              {msg.documents.map((doc, j) => {
                                const checked = !!checkedDocs[`${i}-${j}`];
                                return (
                                  <button
                                    key={j}
                                    onClick={() => toggleDocCheck(i, j)}
                                    aria-pressed={checked}
                                    className="flex w-full items-start gap-2.5 text-left group"
                                  >
                                    <span
                                      className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                                        checked
                                          ? "border-secondary bg-secondary"
                                          : "border-border group-hover:border-accent/50 group-active:scale-90"
                                      }`}
                                    >
                                      {checked && (
                                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className={`text-sm leading-relaxed transition-all ${checked ? "text-muted-light line-through" : "text-foreground"}`}>
                                      {doc}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Office info card */}
                      {msg.office && (
                        <div className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-border bg-surface/50">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Where to go</p>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="h-4 w-4 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{msg.office.name}</p>
                                {msg.office.address && <p className="text-xs text-muted mt-1">{msg.office.address}</p>}
                                {msg.office.hours && <p className="text-xs text-muted mt-0.5">Hours: {msg.office.hours}</p>}
                                {msg.office.website && (
                                  <a
                                    href={msg.office.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-accent hover:underline"
                                  >
                                    Official website
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Source */}
                      {msg.source && (
                        <div className="flex items-center gap-2 text-xs text-muted px-1">
                          <svg className="h-3.5 w-3.5 text-secondary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                          </svg>
                          <span>
                            Source:{" "}
                            {msg.source.url ? (
                              <a href={msg.source.url} target="_blank" rel="noopener noreferrer" className="underline decoration-border underline-offset-2 hover:decoration-accent transition-colors">
                                {msg.source.name}
                              </a>
                            ) : (
                              msg.source.name
                            )}
                          </span>
                          <span className="text-border">&middot;</span>
                          <span>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                        </div>
                      )}

                      {/* Action buttons + Follow-up suggestions */}
                      {i === messages.length - 1 && msg.role === "assistant" && !isLoading && msg.content && (
                        <div className="space-y-2">
                          {msg.type === "error" ? (
                            /* Retry affordance for failed messages */
                            <button
                              onClick={retryLast}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-light px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:border-accent/50 active:scale-[0.97]"
                            >
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                              </svg>
                              Retry
                            </button>
                          ) : (
                            <>
                              {/* Copy / Share / Save / Feedback */}
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(msg.content);
                                    toast("Copied to clipboard");
                                  }}
                                  className="text-xs font-semibold text-muted hover:text-accent transition-colors"
                                >
                                  Copy
                                </button>
                                <span className="text-border">|</span>
                                <button
                                  onClick={() => shareMessage(msg.content)}
                                  className="text-xs font-semibold text-muted hover:text-accent transition-colors"
                                >
                                  Share
                                </button>
                                <span className="text-border">|</span>
                                <button
                                  onClick={() => {
                                    try {
                                      const saved = JSON.parse(localStorage.getItem("sarokar-saved") || "[]");
                                      saved.push({ content: msg.content, date: new Date().toISOString() });
                                      if (saved.length > 50) saved.splice(0, saved.length - 50);
                                      localStorage.setItem("sarokar-saved", JSON.stringify(saved));
                                      toast("Saved to your bookmarks");
                                    } catch {}
                                  }}
                                  className="text-xs font-semibold text-muted hover:text-accent transition-colors"
                                >
                                  Save
                                </button>

                                <span className="flex items-center gap-0.5 ml-auto rounded-full border border-border bg-card/60 px-1 py-0.5">
                                  <button
                                    onClick={() => setFeedback((p) => ({ ...p, [i]: "up" }))}
                                    aria-label="Helpful answer"
                                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-all active:scale-90 ${
                                      feedback[i] === "up" ? "bg-secondary/15 text-secondary" : "text-muted-light hover:text-foreground"
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
                                      feedback[i] === "down" ? "bg-accent/15 text-accent" : "text-muted-light hover:text-foreground"
                                    }`}
                                  >
                                    <svg className="h-3.5 w-3.5 rotate-180" viewBox="0 0 24 24" fill={feedback[i] === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.25l-2.248 5.737a2.25 2.25 0 00-.13.709v2.25c0 .621.504 1.125 1.125 1.125h1.092a2.25 2.25 0 002.09-1.443l.63-1.632M6.633 10.25H3.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125h1.5a2.25 2.25 0 002.25-2.25V12a1.75 1.75 0 00-.492-1.75z" />
                                    </svg>
                                  </button>
                                  {(feedback[i] === "up" || feedback[i] === "down") && (
                                    <span className="pr-1 text-[10px] font-medium text-muted-light">Thanks!</span>
                                  )}
                                </span>
                              </div>

                              {/* Follow-up suggestions */}
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {(msg.steps?.length ? ["What documents do I need?", "What's the fee?", "Can I do this online?"] : ["Tell me more", "What documents do I need?", "Where is the office?"]).map((s, j) => (
                                  <button
                                    key={j}
                                    onClick={() => handleSend(s)}
                                    className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:border-accent/30 hover:text-foreground hover:bg-accent-light active:scale-[0.97]"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loading indicator — only until the first token arrives */}
          {isLoading && !(messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content) && (
            <div className="flex justify-start gap-2.5 animate-slide-in-left mt-5">
              <div className="shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Logo className="h-5 w-5" />
                </div>
              </div>
              <div className="rounded-2xl rounded-tl-md bg-chat-assistant border border-chat-assistant-border px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/40 animate-pulse-dot" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-accent/40 animate-pulse-dot" style={{ animationDelay: "200ms" }} />
                    <span className="h-2 w-2 rounded-full bg-accent/40 animate-pulse-dot" style={{ animationDelay: "400ms" }} />
                  </div>
                  <span className="text-xs text-muted animate-pulse">AI is thinking&hellip;</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border bg-chat-header-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-chat-header-bg/60">
        <div className="mx-auto max-w-3xl px-4 pt-2.5 pb-3 sm:py-3.5 space-y-2.5">
          {/* Quick Topic Pills Bar */}
          <div className="relative">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] sm:[mask-image:none]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-light shrink-0 mr-1 hidden sm:inline">
                Topics:
              </span>
              {quickTopicPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => handlePillClick(pill.query)}
                  disabled={isLoading}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-accent-light hover:text-accent hover:shadow-sm active:scale-[0.96] disabled:opacity-50"
                >
                  <span className="text-xs">{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholders[placeholderIdx]}
                disabled={isLoading}
                className="h-12 sm:h-14 flex-1 rounded-xl border border-chat-input-border bg-chat-input-bg px-4 pr-24 text-sm sm:text-[15px] transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 focus:shadow-[0_0_0_4px_rgba(179,38,45,0.06)] disabled:opacity-50 placeholder:text-muted-light"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 rounded-lg bg-accent px-3.5 sm:px-4 h-9 sm:h-10 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-hover disabled:opacity-30 active:scale-[0.95] flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">Send</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-light text-center sm:text-left">
              Press Enter to send &middot; <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[10px]">⌘K</kbd> to focus &middot; Ask in English, नेपाली, or Roman Nepali
            </p>
            <p className="text-[10px] text-muted-light/80 text-center sm:text-left">
              AI answers can be wrong &mdash; always verify with the official office or website before acting.
            </p>
          </form>
        </div>
      </div>

      <SavedDrawer open={savedOpen} onClose={() => setSavedOpen(false)} />
    </div>
  );
}
