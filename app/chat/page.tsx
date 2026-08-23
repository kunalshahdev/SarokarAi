"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || undefined;

  return (
    <div className="flex h-dvh flex-col">
      <ChatInterface initialQuery={initialQuery} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh flex-col items-center justify-center bg-chat-bg gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center animate-pulse">
            <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6">
              <rect width="40" height="40" rx="10" fill="#B3262D" fillOpacity="0.2" />
              <path d="M12 28V12h4l4 10 4-10h4v16h-3.5V17l-4 11h-3l-4-11v11H12z" fill="#B3262D" fillOpacity="0.4" />
            </svg>
          </div>
          <div className="text-sm text-muted">Loading assistant...</div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
