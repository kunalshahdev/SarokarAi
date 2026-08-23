"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "./toast";

interface SavedItem {
  content: string;
  date: string;
  mode?: string;
  source: "sarokar" | "kct";
}

const KEYS = [
  { key: "sarokar-saved", source: "sarokar" as const },
  { key: "kct-saved", source: "kct" as const },
];

function loadAll(): SavedItem[] {
  if (typeof window === "undefined") return [];
  const items: SavedItem[] = [];
  for (const { key, source } of KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && typeof item.content === "string") {
            items.push({ ...item, source });
          }
        }
      }
    } catch {}
  }
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function SavedDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setItems(loadAll()));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  const removeItem = useCallback((item: SavedItem) => {
    const entry = KEYS.find((k) => k.source === item.source);
    if (!entry) return;
    try {
      const raw = localStorage.getItem(entry.key);
      const list = raw ? JSON.parse(raw) : [];
      const next = list.filter(
        (i: { date: string; content?: string }) => i.date !== item.date || i.content !== item.content
      );
      localStorage.setItem(entry.key, JSON.stringify(next));
      setItems((prev) => prev.filter((i) => !(i.date === item.date && i.content === item.content)));
      toast("Removed from saved");
    } catch {}
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Saved answers">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-card-hover flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">Saved answers</h2>
          <button
            onClick={onClose}
            aria-label="Close saved answers"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 text-3xl">🔖</div>
              <p className="text-sm font-medium text-foreground">Nothing saved yet</p>
              <p className="mt-1 text-xs text-muted max-w-[220px]">
                Tap &ldquo;Save&rdquo; under any assistant answer to keep it here.
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <article
                key={`${item.date}-${i}`}
                className={`rounded-xl border border-border bg-card p-4 ${item.source === "kct" ? "border-l-2 border-l-kct-accent" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-light">
                    {item.source === "kct" ? "K Cha Ta?" : "Sarokar"}
                    {" · "}
                    {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <button
                    onClick={() => removeItem(item)}
                    aria-label="Remove saved answer"
                    className="text-xs font-medium text-muted-light transition-colors hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
                <p className="line-clamp-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {item.content}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(item.content);
                    toast("Copied to clipboard");
                  }}
                  className="mt-2.5 text-xs font-semibold text-accent hover:underline"
                >
                  Copy full answer
                </button>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
