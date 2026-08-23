import { DEFAULTS, REQUEST_CONFIG } from "../config";
import { AIProviderError } from "../errors";
import { ensureOkResponse, fetchUpstream } from "../retry";
import type { AIProvider, ChatMessage, StreamChatOptions } from "../types";
import { sseDataPayloads } from "./sse";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function toGroqMessages(
  messages: ChatMessage[],
  systemPrompt: string
): GroqMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
}

export const groqProvider: AIProvider = {
  id: "groq",

  isConfigured(): boolean {
    return Boolean(process.env.GROQ_API_KEY);
  },

  async streamChat(messages: ChatMessage[], options: StreamChatOptions) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new AIProviderError("groq", "GROQ_API_KEY missing");

    const response = await fetchUpstream(
      "groq",
      GROQ_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: DEFAULTS.groqModel,
          messages: toGroqMessages(messages, options.systemPrompt),
          temperature: options.temperature ?? DEFAULTS.temperature,
          max_tokens: options.maxOutputTokens ?? DEFAULTS.maxOutputTokens,
          stream: true,
        }),
        signal: options.signal,
      },
      REQUEST_CONFIG.upstreamTimeoutMs
    );
    await ensureOkResponse("groq", response);

    async function* generate(): AsyncGenerator<string> {
      for await (const payload of sseDataPayloads(response, options.signal)) {
        if (payload === "[DONE]") break;
        let chunk: { choices?: { delta?: { content?: string } }[] };
        try {
          chunk = JSON.parse(payload);
        } catch {
          continue;
        }
        const text = chunk.choices?.[0]?.delta?.content || "";
        if (text) yield text;
      }
    }

    return generate();
  },
};
