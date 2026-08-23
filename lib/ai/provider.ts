import { MOCK_PROVIDER_ENABLED, PROVIDER_ORDER } from "./config";
import {
  AIProviderError,
  AllProvidersFailedError,
  isFailoverError,
} from "./errors";
import { withRetries } from "./retry";
import type { AIProvider, ChatMessage, StreamChatOptions } from "./types";
import { geminiProvider } from "./providers/gemini";
import { groqProvider } from "./providers/groq";
import { mockProvider } from "./providers/mock";

const REGISTRY: Record<string, AIProvider> = {
  gemini: geminiProvider,
  groq: groqProvider,
  mock: mockProvider,
};

function orderedProviders(): AIProvider[] {
  const order = MOCK_PROVIDER_ENABLED
    ? ["mock", ...PROVIDER_ORDER]
    : PROVIDER_ORDER;
  const seen = new Set<string>();
  const providers: AIProvider[] = [];
  for (const id of order) {
    if (seen.has(id)) continue;
    seen.add(id);
    const provider = REGISTRY[id];
    if (provider) providers.push(provider);
  }
  return providers;
}

export interface FallbackResult {
  providerId: string;
  stream: AsyncIterable<string>;
}

export async function chatWithFallback(
  messages: ChatMessage[],
  options: StreamChatOptions
): Promise<FallbackResult> {
  const attempts: string[] = [];

  for (const provider of orderedProviders()) {
    if (!provider.isConfigured()) {
      attempts.push(`${provider.id}:not-configured`);
      continue;
    }

    try {
      const { value: stream } = await withRetries(
        provider.id,
        () => provider.streamChat(messages, options),
        (err) => err.status !== undefined && err.status >= 400 && err.status < 500 && !isFailoverError(err)
      );
      return { providerId: provider.id, stream };
    } catch (err) {
      if (!(err instanceof AIProviderError)) throw err;
      if (!isFailoverError(err)) {
        console.error(`[ai] ${provider.id} rejected the request permanently`, {
          status: err.status,
          message: err.message,
        });
        throw err;
      }
      attempts.push(...collectAttempts(provider.id, err));
      console.error(
        `[ai] provider failed, moving on -> ${provider.id}: ${err.message}`
      );
    }
  }

  throw new AllProvidersFailedError(attempts);
}

function collectAttempts(id: string, err: unknown): string[] {
  const attached =
    err instanceof AIProviderError && Array.isArray(err.attempts)
      ? err.attempts.filter((a) => a.startsWith(`${id}:`))
      : [];
  return attached.length > 0 ? attached : [`${id}:${(err as Error)?.message ?? "error"}`];
}
