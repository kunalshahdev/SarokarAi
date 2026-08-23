import { NextRequest } from "next/server";
import { handleChatRequest } from "@/lib/ai/handler";
import type { SafetySetting } from "@/lib/ai/types";
import {
  getArticleById,
  searchArticles,
  formatNewsContext,
  timeAgoLabel,
  type NewsArticle,
} from "@/lib/kcha/news-index";

export const maxDuration = 60;

const MAX_MESSAGES = 30;
const RETRIEVAL_LIMIT = 6;
const MAX_CONTEXT_CHARS = 9000;

const SAFETY_SETTINGS: SafetySetting[] = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

const modeInstructions: Record<string, string> = {
  explain:
    "Explain clearly and informatively. Be helpful and thorough.",
  chill:
    "Be casual and relaxed. Use natural Roman Nepali or casual English. Keep it light but accurate.",
  tldr:
    "Give an extremely short summary. Maximum 3-4 sentences. No fluff.",
  nepali:
    "Respond entirely in Nepali (Devanagari script). Keep it simple and clear.",
  roman:
    "Respond in Roman Nepali. Write exactly how a Nepali person would text. Be casual and natural.",
  deep:
    "Give a comprehensive deep dive. Include background, context, implications, and related topics. Be thorough.",
};

const kChaTaSystemPrompt = `You are K Cha Ta? — a playful, curious, and knowledgeable assistant built into Sarokar.

You help young Nepali users understand what's happening online and in the world around them.

YOUR PERSONALITY:
- You're like a smart friend who actually knows what's going on
- You're playful but never fake or cringe
- You understand Nepali internet culture deeply
- You mix English, Nepali, and Roman Nepali naturally
- You're honest about what you know vs what you don't
- You can switch between serious and casual instantly
- You never say "Hello fellow Gen-Zs!" or try too hard to be cool

YOUR CAPABILITIES:
- Explain trending topics and viral content
- Break down current events in simple terms
- Help with career, education, and tech questions
- Verify claims and debunk misinformation
- Discuss Nepal-related topics with local context
- Explain internet culture and memes

IMPORTANT RULES:
1. NEVER present rumours as facts. Always distinguish between confirmed, reported, unverified, and opinion.
2. If something is still developing, say so clearly.
3. If you're not sure about something, say "Yo kura ko reliable confirmation bhetena, so ma guess gardina."
4. Don't invent trending topics or engagement numbers.
5. Always be willing to say "I don't know" — that builds trust.
6. When explaining something, include sources where possible.
7. Keep responses useful first, entertaining second.
8. Match the user's language — if they write in Roman Nepali, respond in Roman Nepali.

NO BAKWAS RULE:
When a user asks for "no bakwas" mode or says "just tell me what matters", give them:
- The core fact in 1-2 sentences
- Why people care in 1-2 sentences
- What they should know in 1-2 sentences
- That's it. Nothing else.

VERIFICATION MODE:
When asked to verify a claim (e.g. queries starting with "Verify this:" or asking if a rumor is true):
1. Give a clear verdict header at the very top:
   - 🟢 **LIKELY TRUE** (if official evidence/rules support it)
   - 🟡 **UNCLEAR / DEVELOPING** (if ongoing or mixed signals)
   - 🔴 **FALSE / MISLEADING** (if contradicted by official laws/facts)
   - ⚪ **NOT ENOUGH INFORMATION** (if unverified rumor with no credible source)
2. Explain **The Facts (सत्य के हो?)** in clear, simple bullet points.
3. Explain **Why people are confused / Where the rumor came from**.
4. Mention the relevant Nepali ministry, authority, or law where applicable.
5. If in doubt, say "Yo kura ko reliable official confirmation bhetena".

COMPLETENESS RULE:
Always finish every numbered item completely. Never stop mid-sentence or cut off before finishing the final point.`;

function sanitizeForPrompt(input: string): string {
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").slice(0, 3000);
}

export interface GroundedSource {
  n: number;
  title: string;
  source: string;
  url: string;
  time: string;
}

interface Grounding {
  contextBlock: string;
  sources: GroundedSource[];
}

async function buildGrounding(
  query: string,
  articleId?: string
): Promise<Grounding> {
  const sources: GroundedSource[] = [];
  const sections: string[] = [];
  let focusArticle: NewsArticle | null = null;

  if (articleId) {
    try {
      focusArticle = await getArticleById(articleId);
    } catch {}
    if (focusArticle) {
      sources.push({
        n: 1,
        title: sanitizeForPrompt(focusArticle.title),
        source: focusArticle.source,
        url: focusArticle.url,
        time: timeAgoLabel(focusArticle.publishedAt),
      });
      sections.push(
        `[FOCUS ARTICLE — the user is asking about this story]\n` +
          formatNewsContext([focusArticle]).replace(/^\[1\]/, "[1]")
      );
    }
  }

  try {
    const hits = await searchArticles(query, RETRIEVAL_LIMIT);
    const relevant = hits.filter((h) => h.id !== focusArticle?.id);
    const room = MAX_CONTEXT_CHARS - sections.join("\n\n").length;
    if (relevant.length > 0 && room > 400) {
      const nextNumber = sources.length + 1;
      const block = formatNewsContext(relevant)
        .split(/\n\n(?=\[\d+\])/)
        .map((entry, i) => entry.replace(/^\[\d+\]/, `[${nextNumber + i}]`))
        .join("\n\n");
      if (block.length <= room) {
        relevant.forEach((a, i) => {
          sources.push({
            n: nextNumber + i,
            title: sanitizeForPrompt(a.title),
            source: a.source,
            url: a.url,
            time: timeAgoLabel(a.publishedAt),
          });
        });
        sections.push(block);
      }
    }
  } catch {}

  if (sections.length === 0) return { contextBlock: "", sources };

  const contextBlock =
    `\n\n[LIVE NEWS CONTEXT — retrieved just now from Nepali news feeds]\n` +
    sections.join("\n\n") +
    `\n[/LIVE NEWS CONTEXT]` +
    `\n\nGROUNDING RULES (strict):` +
    `\n- Treat LIVE NEWS CONTEXT as your primary evidence for anything current. Today's date matters.` +
    `\n- When you state facts that come from these articles, cite them inline like [1] or [2] using the exact numbers above.` +
    `\n- NEVER invent quotes, statistics, names, or events that are not in the context.` +
    `\n- If the user's question is not covered by the context, say clearly "Yo topic ahile ko live coverage ma bhetina" and only then fall back to background knowledge, labeling it as background.` +
    `\n- If articles conflict, say what is confirmed vs reported vs unverified.`;

  return { contextBlock, sources };
}

export async function POST(request: NextRequest) {
  const currentYear = new Date().getFullYear();
  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return handleChatRequest(request, {
    maxMessages: MAX_MESSAGES,
    safetySettings: SAFETY_SETTINGS,
    prepare: async (lastUserMessage, body) => {
      const requestedMode = typeof body.mode === "string" ? body.mode : "explain";
      const modeInstruction =
        modeInstructions[requestedMode] || modeInstructions.explain;

      const articleId =
        typeof body.articleId === "string" && body.articleId.length < 200
          ? body.articleId
          : undefined;

      let grounding: Grounding = { contextBlock: "", sources: [] };
      try {
        grounding = await buildGrounding(lastUserMessage, articleId);
      } catch (e) {
        console.warn("[kcha] grounding retrieval failed", e);
      }

      const fullSystemInstruction =
        `${kChaTaSystemPrompt}\n\nTEMPORAL ANCHOR: Today is ${currentDateStr} (Year: ${currentYear}).` +
        ` Always prioritize recent information and current ${currentYear} events.\n\n` +
        `CURRENT MODE INSTRUCTION:\n${modeInstruction}` +
        grounding.contextBlock +
        `\n\nLANGUAGE POLICY:\nUsers may communicate in Roman Nepali, Nepali Devanagari, English, or mixed Nepali-English.\nUnderstand informal Roman Nepali spelling and variations naturally.\nMatch the user's language naturally in every response.`;

      return {
        systemPrompt: fullSystemInstruction,
        meta:
          grounding.sources.length > 0
            ? { sources: grounding.sources }
            : null,
      };
    },
  });
}
