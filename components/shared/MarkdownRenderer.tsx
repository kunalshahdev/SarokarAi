"use client";

interface MarkdownRendererProps {
  content: string;
  variant?: "sarokar" | "kchata";
}

function isValidHref(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return href.startsWith("/");
  }
}

function MarkdownRenderer({ content, variant = "sarokar" }: MarkdownRendererProps) {
  const isKct = variant === "kchata";

  const renderInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|__(.+?)__|\_(.+?)\_|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1] || match[2]) {
        parts.push(
          <strong key={key++} className={`font-semibold ${isKct ? "" : "text-foreground"}`}>
            {match[1] || match[2]}
          </strong>
        );
      } else if (match[3] || match[4]) {
        parts.push(<em key={key++}>{match[3] || match[4]}</em>);
      } else if (match[5]) {
        parts.push(
          <code
            key={key++}
            className={`rounded px-1 py-0.5 text-xs font-mono ${
              isKct
                ? "bg-kct-surface text-kct-accent"
                : "bg-surface text-accent"
            }`}
          >
            {match[5]}
          </code>
        );
      } else if (match[6] && match[7]) {
        const href = match[7];
        if (isValidHref(href)) {
          parts.push(
            <a
              key={key++}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 hover:opacity-80 ${
                isKct ? "text-kct-accent" : "text-accent hover:text-accent-hover"
              }`}
            >
              {match[6]}
            </a>
          );
        } else {
          parts.push(<span key={key++}>{match[6]}</span>);
        }
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let elKey = 0; // dedicated monotonic key — never duplicates

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={elKey++}
          className={`my-2 overflow-x-auto rounded-lg p-3 text-xs font-mono leading-relaxed ${
            isKct ? "bg-kct-surface" : "bg-surface"
          }`}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={elKey++} className="my-1.5 space-y-1 pl-4">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  isKct ? "bg-kct-accent/60" : "bg-accent/60"
                }`}
              />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={elKey++} className="my-1.5 space-y-1 pl-4 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2">
              <span
                className={`shrink-0 font-semibold text-xs mt-0.5 ${
                  isKct ? "text-kct-accent/80" : "text-accent/80"
                }`}
              >
                {idx + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^(#+)/)?.[1].length || 1;
      const text = line.replace(/^#+\s/, "");
      const cls =
        level === 1
          ? "text-base font-bold mt-2 mb-1"
          : "text-sm font-semibold mt-1.5 mb-0.5";
      elements.push(
        <p key={elKey++} className={cls}>
          {renderInline(text)}
        </p>
      );
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      elements.push(
        <hr key={elKey++} className={`my-2 ${isKct ? "border-kct-border" : "border-border"}`} />
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={elKey++} className="h-1.5" />);
      i++;
      continue;
    }

    elements.push(
      <p key={elKey++} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5 text-sm">{elements}</div>;
}

export default MarkdownRenderer;
