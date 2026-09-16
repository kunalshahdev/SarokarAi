import { NextRequest } from "next/server";
import { handleChatRequest } from "@/lib/ai/handler";
import type { SafetySetting } from "@/lib/ai/types";
import {
  resolveArticle,
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
    `Explain clearly and informatively. Structure your response with a brief intro, then clear points or steps. Be thorough but not padded. Use simple language a 20-year-old Nepali would understand. Mix English and Roman Nepali naturally where it helps clarity.`,

  chill:
    `Be super casual and relaxed — like texting a smart Nepali friend. Use natural Roman Nepali mixed with English. Use phrases like "bro", "yaar", "k cha", "suno", "basically", "tbh", "ngl", "legit". Keep sentences short. Use emojis sparingly but naturally (don't overdo it). Never sound corporate or formal. Never say "Hello!" or "Great question!". Just dive in. Example tone: "k cha bro, basically yo kura yo ho — [explanation]. suno, important part chai..."`,

  tldr:
    `Give an ultra-short summary. STRICT FORMAT:
**K bhayo:** [1 sentence — the core event/fact]
**Kina important:** [1 sentence — why people care]
**Timi lai k thahaa hunuparchha:** [1 sentence — what you should know]
Nothing else. No intro. No outro. No "In conclusion". Hard limit: 4 sentences total across all three points. If you cannot fit it in 4 sentences, cut mercilessly.`,

  nepali:
    `सम्पूर्ण जवाफ नेपाली (देवनागरी) मा दिनुहोस्। सरल र स्पष्ट भाषा प्रयोग गर्नुहोस् — सरकारी वा अत्यधिक औपचारिक शब्दहरू नगर्नुहोस्। २०-२५ वर्षका नेपाली युवाले सजिलै बुझ्ने भाषा प्रयोग गर्नुहोस्। तथ्यहरू स्पष्ट र बुलेट पोइन्टमा राख्नुहोस्।`,

  roman:
    `Respond ONLY in Roman Nepali — exactly how a Nepali person would type on WhatsApp or Instagram. Rules:
- Write phonetically: "kasto cha" not "kasto chha", "bhayo" not "vayo" (both fine actually), "kasari" "kina" "ke" etc.
- Mix some English words naturally as Nepalis do: "basically", "actually", "btw", "ngl", "tbh"
- Keep it conversational and warm
- Don't use Devanagari at all
- Don't be overly formal
- Example: "yo kura basically yesto ho bro — [explanation]. ani important kura chai, [point]. kasari garne bhane [steps]."`,

  deep:
    `Give a comprehensive, well-structured deep dive. Use markdown headers to organize. Structure:
## Background (Yo K Ho?)
[Context and history]
## K Bhayo? (What Happened)
[Current situation / facts]
## Kina Important Cha? (Why It Matters)
[Implications and significance]
## Nepali Context
[How this specifically affects Nepal or Nepalis]
## Thaha Raakhnu Parne Kura (Key Takeaways)
[3-5 bullet points]
Be thorough. Include nuance. Cite sources with [n] notation where applicable.`,
};

const EMPTY_CONTEXT_GUARD = `\n\nHALLUCINATION GUARD (STRICT):
If the LIVE NEWS CONTEXT section is empty or absent, you MUST:
1. Say clearly: "Yo topic ko bare ma ahile live news context bhetena." before answering.
2. Only then provide background knowledge, clearly labeled as: "(Background knowledge — verify with current sources)"
3. NEVER present background knowledge as current/breaking news.
4. NEVER invent trending topics, viral posts, engagement numbers, or quote specific people unless from context.`;

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

interface FocusRef {
  id?: string;
  url?: string;
  title?: string;
}

async function buildGrounding(
  query: string,
  focus?: FocusRef
): Promise<Grounding> {
  const sources: GroundedSource[] = [];
  const sections: string[] = [];
  let focusArticle: NewsArticle | null = null;
  let focusUrl: string | undefined;

  if (focus && (focus.id || focus.url || focus.title)) {
    try {
      focusArticle = await resolveArticle({ id: focus.id, url: focus.url });
    } catch {}

    if (focusArticle) {
      focusUrl = focusArticle.url;
      sources.push({
        n: 1,
        title: sanitizeForPrompt(focusArticle.title),
        source: focusArticle.source,
        url: focusArticle.url,
        time: timeAgoLabel(focusArticle.publishedAt),
      });
      sections.push(
        `[FOCUS ARTICLE — the user is asking about this story]\n` +
          formatNewsContext([focusArticle])
      );
    } else if (focus.title || focus.url) {
      // Not in the index cache — still anchor the conversation to the story's
      // identity so follow-ups stay on-topic, even without full body text.
      focusUrl = focus.url;
      const stubTitle = sanitizeForPrompt(focus.title || focus.url || "");
      sources.push({
        n: 1,
        title: stubTitle,
        source: "",
        url: focus.url || "",
        time: "",
      });
      sections.push(
        `[FOCUS ARTICLE — the user is asking about this story]\n` +
          `[1] ${stubTitle}` +
          (focus.url ? `\nURL: ${focus.url}` : "") +
          `\n(Full article text not available — rely on retrieved context below and be honest about what is not yet confirmed.)`
      );
    }
  }

  try {
    const hits = await searchArticles(query, RETRIEVAL_LIMIT);
    const relevant = hits.filter(
      (h) => h.id !== focusArticle?.id && (!focusUrl || h.url !== focusUrl)
    );
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
      const aboutUrl =
        typeof body.aboutUrl === "string" && body.aboutUrl.length <= 500
          ? body.aboutUrl
          : undefined;
      const aboutTitle =
        typeof body.aboutTitle === "string" && body.aboutTitle.length <= 300
          ? body.aboutTitle
          : undefined;

      let grounding: Grounding = { contextBlock: "", sources: [] };
      try {
        grounding = await buildGrounding(lastUserMessage, {
          id: articleId,
          url: aboutUrl,
          title: aboutTitle,
        });
      } catch (e) {
        console.warn("[kcha] grounding retrieval failed", e);
      }

      const fullSystemInstruction =
        `${kChaTaSystemPrompt}\n\nTEMPORAL ANCHOR: Today is ${currentDateStr} (Year: ${currentYear}).` +
        ` Always prioritize recent information and current ${currentYear} events.\n\n` +
        `CURRENT MODE INSTRUCTION:\n${modeInstruction}` +
        grounding.contextBlock +
        EMPTY_CONTEXT_GUARD +
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
