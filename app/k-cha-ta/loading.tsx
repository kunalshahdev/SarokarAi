export default function KChaTaLoading() {
  return (
    <div className="min-h-screen bg-kct-surface text-foreground">
      {/* Hero skeleton */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-kct-surface">
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
          <div className="h-5 w-48 rounded-full border border-kct-border bg-kct-card animate-shimmer mb-6" />
          <div className="max-w-3xl">
            <div className="h-14 sm:h-16 md:h-[64px] w-64 rounded bg-border animate-shimmer mb-4" />
            <div className="h-6 w-80 rounded bg-border/60 animate-shimmer" />
          </div>
          <div className="mt-10 max-w-2xl">
            <div className="h-16 md:h-16 w-full rounded-2xl border border-kct-border bg-kct-card animate-shimmer" />
            <div className="mt-6 flex gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-24 rounded-lg border border-kct-border bg-kct-card animate-shimmer" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
