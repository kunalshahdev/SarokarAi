export default function ChatLoading() {
  return (
    <div className="flex flex-col h-dvh bg-chat-bg">
      {/* Header skeleton */}
      <header className="shrink-0 border-b border-border bg-chat-header-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="h-4 w-20 rounded bg-border animate-shimmer" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-light/30" />
            <div className="h-3 w-12 rounded bg-border animate-shimmer" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-6 h-14 w-14 rounded-xl bg-accent/10 animate-pulse" />
            <div className="h-8 w-48 rounded bg-border animate-shimmer mb-3" />
            <div className="h-4 w-64 rounded bg-border/60 animate-shimmer" />
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-36 rounded-xl bg-border/40 animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="shrink-0 border-t border-border bg-chat-header-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
          <div className="h-12 sm:h-14 rounded-xl bg-border/40 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
