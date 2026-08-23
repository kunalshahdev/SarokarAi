"use client";

const categories = [
  { id: "trending", label: "Trending", icon: "🔥" },
  { id: "nepal", label: "Nepal", icon: "🇳🇵" },
  { id: "student", label: "Student Life", icon: "🎓" },
  { id: "jobs", label: "Jobs & Career", icon: "💼" },
  { id: "tech", label: "Tech", icon: "💻" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "sports", label: "Sports", icon: "🏏" },
  { id: "world", label: "World", icon: "🌍" },
  { id: "money", label: "Money", icon: "💰" },
  { id: "explain", label: "Explain This", icon: "🧠" },
];

interface TopicCategoriesProps {
  onSelect?: (categoryLabel: string) => void;
}

export default function TopicCategories({ onSelect }: TopicCategoriesProps) {
  return (
    <section className="py-5 border-y border-kct-border/80 bg-kct-surface/60 backdrop-blur-sm">
      <div className="mx-auto max-w-[1280px] px-5 md:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5 md:mx-0 md:px-0">
          <span className="text-xs font-bold uppercase tracking-wider text-kct-muted shrink-0 mr-2 hidden md:inline">
            Explore:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat.label)}
              aria-label={`Ask about ${cat.label}`}
              className="min-h-11 shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 text-xs font-bold
                transition-all duration-200 whitespace-nowrap active:scale-[0.97]
                bg-kct-card border border-kct-border text-kct-muted hover:border-kct-accent/40 hover:text-foreground hover:bg-kct-card hover:shadow-sm"
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
