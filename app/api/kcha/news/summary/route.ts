import { NextRequest, NextResponse } from "next/server";
import { chatWithFallback } from "@/lib/ai/provider";
import { resolveArticle, timeAgoLabel } from "@/lib/kcha/news-index";
import { fetchArticleText, isAllowedArticleUrl } from "@/lib/kcha/article-fetch";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const maxDuration = 60;

const SUMMARY_TTL_MS = 60 * 60 * 1000;
const MAX_TEXT_FOR_PROMPT = 6000;

interface ArticleSummary {
  tldr: string;
  keyPoints: string[];
  whyItMatters: string;
}

interface CacheEntry {
  summary: ArticleSummary;
  fetchedAt: number;
}

const summaryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ArticleSummary | null>>();

const SUMMARY_SYSTEM_PROMPT = `You are the news summarizer inside K Cha Ta?, a Nepali internet-culture assistant read mostly by Gen-Z Nepalis.

You will receive ONE news article (title + body). Produce a strict JSON object with exactly these keys:
{
  "tldr": "2-3 sentence summary of what happened",
  "keyPoints": ["3 to 5 short factual bullet points"],
  "whyItMatters": "1-2 sentences on why this matters for young Nepalis"
}

LANGUAGE — ROMAN NEPALI (most important rule):
- Write EVERYTHING (tldr, every keyPoint, whyItMatters) in Roman Nepali — Nepali typed in English letters, exactly how Nepali Gen-Z text on Instagram and WhatsApp. Use NO Devanagari at all.
- Write phonetically and naturally: "k bhayo", "yesto bhayo", "hune bhayo", "kina important cha", "rahecha", "re", "ni".
- Mix in the English words Nepalis actually use — "basically", "actually", "government", "match", "price", "season" — don't force-translate proper nouns or technical terms.
- Keep proper nouns (people, places, teams, orgs, numbers) exactly as they are. Never mangle a name.
- Tone: warm and conversational, like explaining to a friend — not formal "khabar" style, not robotic. A little casual energy is good, but facts come first: don't add slang filler or emojis.

RULES:
- Output ONLY the JSON object. No markdown fences, no commentary.
- Use the article's facts only. Never invent names, numbers, or quotes.
- If the article body is too short or is just a headline, keep keyPoints to 2 and honestly say k thaha bhaisakeko chhaina (what is not yet known).`;

function extractJson(raw: string): ArticleSummary | null {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (
      typeof parsed.tldr !== "string" ||
      !Array.isArray(parsed.keyPoints)
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

async function generateSummary(
  title: string,
  text: string
): Promise<ArticleSummary | null> {
  try {
    const { stream } = await chatWithFallback(
      [
        {
          role: "user",
          content: `Article title: ${title}\n\nArticle body:\n${text.slice(0, MAX_TEXT_FOR_PROMPT)}\n\nSummarize per instructions.`,
        },
      ],
      { systemPrompt: SUMMARY_SYSTEM_PROMPT }
    );

    let raw = "";
    for await (const delta of stream) raw += delta;
    return extractJson(raw);
  } catch (e) {
    console.error("[kcha/summary] generation failed", e);
    return null;
  }
}

// Resolve the best available body text for a story, then summarize it.
// Order: (1) scrape the full article page, (2) fall back to the RSS/index body
// already in cache, (3) last resort summarize from the headline alone. This
// guarantees a trending story never dead-ends at "not found".
async function resolveSummary(
  url: string,
  title: string,
  indexedText?: string
): Promise<ArticleSummary | null> {
  let text = "";
  try {
    text = (await fetchArticleText(url)) || "";
  } catch {
    text = "";
  }
  if (text.length < 200 && indexedText && indexedText.length > text.length) {
    text = indexedText;
  }
  if (!text) text = title;
  return generateSummary(title, text);
}

export async function POST(request: NextRequest) {
  let body: { id?: unknown; url?: unknown; title?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const url = typeof body.url === "string" ? body.url : "";
  const providedTitle = typeof body.title === "string" ? body.title.slice(0, 300) : "";

  // A valid, allowlisted URL is required — it's both the summary cache key and
  // the SSRF gate for the on-demand article fetch.
  if (!url || url.length > 500 || !isAllowedArticleUrl(url)) {
    return NextResponse.json(
      { error: "Missing or unsupported article url." },
      { status: 400 }
    );
  }
  if (id.length > 200) {
    return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  }

  const ip = getClientIdentifier(request);
  const rl = checkRateLimit(`kct-summary:${ip}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many summaries. Ek chin pachi try garnus." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  // The URL is our stable identity across the trending/news-index caches.
  const cacheKey = url;

  // Best-known metadata for the response, enriched if the article is indexed.
  const indexed = await resolveArticle({ id, url }).catch(() => null);
  const meta = {
    id: id || url,
    title: indexed?.title || providedTitle || url,
    source: indexed?.source || "",
    url,
    time: indexed ? timeAgoLabel(indexed.publishedAt) : "",
  };

  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < SUMMARY_TTL_MS) {
    return NextResponse.json({ summary: cached.summary, cached: true, article: meta });
  }

  if (!inflight.has(cacheKey)) {
    inflight.set(
      cacheKey,
      resolveSummary(url, meta.title, indexed?.text).finally(() => {
        inflight.delete(cacheKey);
      })
    );
  }
  const summary = await inflight.get(cacheKey)!;

  if (!summary) {
    return NextResponse.json(
      { error: "Summary banauna sakena. Ali pachi feri try garnus." },
      { status: 503 }
    );
  }

  summaryCache.set(cacheKey, { summary, fetchedAt: Date.now() });
  if (summaryCache.size > 300) {
    const oldest = summaryCache.keys().next().value;
    if (oldest) summaryCache.delete(oldest);
  }

  return NextResponse.json({ summary, cached: false, article: meta });
}
