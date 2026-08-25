export interface ArticleSummary {
  tldr: string;
  keyPoints: string[];
  whyItMatters: string;
}

// Parse a model-generated JSON summary. Models occasionally wrap JSON in
// markdown fences or add commentary, so we slice from the first "{" to the
// last "}" and validate the shape defensively.
export function extractJson(raw: string): ArticleSummary | null {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (
      typeof parsed?.tldr !== "string" ||
      !Array.isArray(parsed?.keyPoints)
    ) {
      return null;
    }
    return {
      tldr: parsed.tldr,
      keyPoints: parsed.keyPoints
        .filter((p: unknown): p is string => typeof p === "string")
        .slice(0, 5),
      whyItMatters:
        typeof parsed.whyItMatters === "string" ? parsed.whyItMatters : "",
    };
  } catch {
    return null;
  }
}
