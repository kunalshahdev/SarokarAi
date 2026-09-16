import { DEFAULTS, REQUEST_CONFIG } from "../config";
import { AIProviderError } from "../errors";
import { ensureOkResponse, fetchUpstream } from "../retry";
import type { AIProvider, ChatMessage, StreamChatOptions } from "../types";
import { sseDataPayloads } from "./sse";

interface OpenAICompatibleConfig {
  id: string;
  apiUrl: string;
  apiKeyEnv: string;
  model: () => string;
  extraHeaders?: Record<string, string>;
}

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

function toMessages(
  messages: ChatMessage[],
  systemPrompt: string
): OpenAIMessage[] {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
}

export function createOpenAICompatibleProvider(
  config: OpenAICompatibleConfig
): AIProvider {
  return {
    id: config.id,

    isConfigured(): boolean {
      return Boolean(process.env[config.apiKeyEnv]);
    },

    async streamChat(messages: ChatMessage[], options: StreamChatOptions) {
      const apiKey = process.env[config.apiKeyEnv];
      if (!apiKey) {
        throw new AIProviderError(config.id, `${config.apiKeyEnv} missing`);
      }

      const response = await fetchUpstream(
        config.id,
        config.apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            ...config.extraHeaders,
          },
          body: JSON.stringify({
            model: config.model(),
            messages: toMessages(messages, options.systemPrompt),
            temperature: options.temperature ?? DEFAULTS.temperature,
            max_tokens: options.maxOutputTokens ?? DEFAULTS.maxOutputTokens,
            stream: true,
          }),
          signal: options.signal,
        },
        REQUEST_CONFIG.upstreamTimeoutMs
      );
      await ensureOkResponse(config.id, response);

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
}
