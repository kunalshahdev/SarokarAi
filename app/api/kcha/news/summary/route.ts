import { NextRequest, NextResponse } from "next/server";
import { chatWithFallback } from "@/lib/ai/provider";
import {
  getArticleById,
  timeAgoLabel,
} from "@/lib/kcha/news-index";
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

const SUMMARY_SYSTEM_PROMPT = `You are a news summarizer inside K Cha Ta?, a Nepali internet-culture assistant.

You will receive ONE news article (title + body). Produce a strict JSON object with exactly these keys:
{
  "tldr": "2-3 sentence plain-language summary of what happened",
  "keyPoints": ["3 to 5 short factual bullet points"],
  "whyItMatters": "1-3 sentences on why this matters for young Nepalis"
}

RULES:
- Output ONLY the JSON object. No markdown fences, no commentary.
- Use the article's facts only. Never invent names, numbers, or quotes.
- If the article body is too short or is just a headline, keep keyPoints to 2 and say honestly what is not yet known.
- Match the article's dominant language style but prefer simple English with natural Nepali words where helpful.`;

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

export async function POST(request: NextRequest) {
  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id || id.length > 200) {
    return NextResponse.json({ error: "Missing article id." }, { status: 400 });
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

  let article;
  try {
    article = await getArticleById(id);
  } catch {
    article = null;
  }
  if (!article) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404 }
    );
  }

  const cached = summaryCache.get(id);
  if (cached && Date.now() - cached.fetchedAt < SUMMARY_TTL_MS) {
    return NextResponse.json({
      summary: cached.summary,
      cached: true,
      article: {
        id,
        title: article.title,
        source: article.source,
        url: article.url,
        time: timeAgoLabel(article.publishedAt),
      },
    });
  }

  if (!inflight.has(id)) {
    inflight.set(
      id,
      generateSummary(article.title, article.text).finally(() => {
        inflight.delete(id);
      })
    );
  }
  const summary = await inflight.get(id)!;

  if (!summary) {
    return NextResponse.json(
      { error: "Summary banauna sakena. Ali pachi feri try garnus." },
      { status: 503 }
    );
  }

  summaryCache.set(id, { summary, fetchedAt: Date.now() });
  if (summaryCache.size > 300) {
    const oldest = summaryCache.keys().next().value;
    if (oldest) summaryCache.delete(oldest);
  }

  return NextResponse.json({
    summary,
    cached: false,
    article: {
      id,
      title: article.title,
      source: article.source,
      url: article.url,
      time: timeAgoLabel(article.publishedAt),
    },
  });
}
