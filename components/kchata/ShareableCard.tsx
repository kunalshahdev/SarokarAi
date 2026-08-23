"use client";

interface ShareableCardProps {
  title: string;
  summary: string;
}

export default function ShareableCard({ title, summary }: ShareableCardProps) {
  return (
    <div className="rounded-2xl border-2 border-kct-border bg-kct-card overflow-hidden max-w-md">
      {/* Header stripe */}
      <div className="bg-foreground px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-background tracking-tight">
            K CHA TA?
          </span>
          <span className="text-[10px] font-bold text-background/50 uppercase tracking-widest">
            30 sec explainer
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <h3 className="text-lg font-extrabold text-foreground leading-snug tracking-tight">
          {title}
        </h3>
        <p className="mt-3 text-sm text-kct-muted leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-kct-border flex items-center justify-between">
        <span className="text-xs font-bold text-kct-muted tracking-tight">
          Sarokar
        </span>
        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-kct-accent hover:underline">
            Copy
          </button>
          <button className="text-xs font-semibold text-kct-accent hover:underline">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
