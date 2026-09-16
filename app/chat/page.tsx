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
              <path d="M7.5 28.5 14 13.5 20 22.5 26 13.5 32.5 28.5Z" fill="#B3262D" fillOpacity="0.35" stroke="#B3262D" strokeOpacity="0.35" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="28.75" cy="10" r="2.25" fill="#B3262D" fillOpacity="0.35" />
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
