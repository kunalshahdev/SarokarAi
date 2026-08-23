import { NextRequest } from "next/server";
import { handleChatRequest } from "@/lib/ai/handler";
import type { SafetySetting } from "@/lib/ai/types";

const MAX_MESSAGES = 30;

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

async function fetchLiveNewsContext(origin: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const trendingRes = await fetch(`${origin}/api/kcha/trending`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!trendingRes.ok) return "";
    const trendingData = await trendingRes.json();
    if (!trendingData.topics || trendingData.topics.length === 0) return "";
    const headlineList = trendingData.topics
      .map(
        (t: { title: string; explanation: string; source: string; time: string }, idx: number) =>
          `${idx + 1}. [${t.source} - ${t.time}] ${sanitizeForPrompt(t.title)}: ${sanitizeForPrompt(t.explanation)}`
      )
      .join("\n");
    return `\n\n[LIVE NEWS CONTEXT]\n${headlineList}\n[/LIVE NEWS CONTEXT]`;
  } catch (e) {
    console.warn("Could not fetch live trending news for prompt injection:", e);
    return "";
  }
}

export async function POST(request: NextRequest) {
  const liveNewsContext = await fetchLiveNewsContext(request.nextUrl.origin);

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
    prepare: (lastUserMessage, body) => {
      void lastUserMessage;
      const requestedMode = typeof body.mode === "string" ? body.mode : "explain";
      const modeInstruction =
        modeInstructions[requestedMode] || modeInstructions.explain;

      const fullSystemInstruction =
        `${kChaTaSystemPrompt}\n\nTEMPORAL ANCHOR: Today is ${currentDateStr} (Year: ${currentYear}).` +
        ` Always prioritize recent information and current ${currentYear} events.\n\n` +
        `CURRENT MODE INSTRUCTION:\n${modeInstruction}` +
        liveNewsContext +
        `\n\nLANGUAGE POLICY:\nUsers may communicate in Roman Nepali, Nepali Devanagari, English, or mixed Nepali-English.\nUnderstand informal Roman Nepali spelling and variations naturally.\nMatch the user's language naturally in every response.`;

      return { systemPrompt: fullSystemInstruction, meta: null };
    },
  });
}
