"use client";

import { useEffect, useState } from "react";

const TOAST_EVENT = "sarokar-toast";

export function toast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }));
}

interface ToastItem {
  id: number;
  message: string;
  leaving?: boolean;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      const id = ++counter;
      setToasts((prev) => [...prev.slice(-2), { id, message }]);

      timeouts.push(
        setTimeout(() => {
          setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
          timeouts.push(
            setTimeout(() => {
              setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 200)
          );
        }, 2400)
      );
    };

    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-full border border-border bg-foreground px-4 py-2 text-sm font-medium text-background shadow-card-hover transition-all duration-200 ${
            t.leaving ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
