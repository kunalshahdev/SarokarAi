import { DEFAULTS, REQUEST_CONFIG } from "../config";
import { AIProviderError } from "../errors";
import { ensureOkResponse, fetchUpstream } from "../retry";
import type { AIProvider, ChatMessage, StreamChatOptions } from "../types";
import { sseDataPayloads } from "./sse";

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export const geminiProvider: AIProvider = {
  id: "gemini",

  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  },

  async streamChat(messages: ChatMessage[], options: StreamChatOptions) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new AIProviderError("gemini", "GEMINI_API_KEY missing");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULTS.geminiModel}:streamGenerateContent?alt=sse`;

    const body: Record<string, unknown> = {
      contents: toGeminiContents(messages),
      systemInstruction: {
        parts: [{ text: options.systemPrompt }],
      },
      generationConfig: {
        temperature: options.temperature ?? DEFAULTS.temperature,
        maxOutputTokens:
          options.maxOutputTokens ?? DEFAULTS.maxOutputTokens,
      },
    };
    if (options.safetySettings?.length) {
      body.safetySettings = options.safetySettings;
    }

    const response = await fetchUpstream(
      "gemini",
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
        signal: options.signal,
      },
      REQUEST_CONFIG.upstreamTimeoutMs
    );
    await ensureOkResponse("gemini", response);

    async function* generate(): AsyncGenerator<string> {
      for await (const payload of sseDataPayloads(response, options.signal)) {
        if (payload === "[DONE]") break;
        let chunk: {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        try {
          chunk = JSON.parse(payload);
        } catch {
          continue;
        }
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        const text = parts.map((p) => p.text || "").join("");
        if (text) yield text;
      }
    }

    return generate();
  },
};
