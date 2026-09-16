import { RETRY_CONFIG } from "./config";
import { AIProviderError, classifyProviderError, isFailoverError } from "./errors";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(attempt: number): number {
  const { baseDelayMs, maxDelayMs } = RETRY_CONFIG;
  const exponential = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
  const jitter = exponential * (0.7 + Math.random() * 0.6);
  return Math.round(jitter);
}

export async function fetchUpstream(
  provider: string,
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const externalSignal = init.signal as AbortSignal | undefined;

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) onExternalAbort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    if (externalSignal?.aborted) throw err;
    throw new AIProviderError(provider, `network error: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}

export async function ensureOkResponse(
  provider: string,
  response: Response
): Promise<void> {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  throw classifyProviderError(provider, response.status, body);
}

interface AttemptResult<T> {
  value: T;
  attempts: string[];
}

export async function withRetries<T>(
  provider: string,
  fn: () => Promise<T>,
  shouldThrowImmediately?: (err: AIProviderError) => boolean
): Promise<AttemptResult<T>> {
  const attempts: string[] = [];
  const total = RETRY_CONFIG.maxRetriesPerProvider + 1;

  for (let attempt = 0; attempt < total; attempt++) {
    try {
      const value = await fn();
      return { value, attempts };
    } catch (err) {
      if (!(err instanceof AIProviderError)) throw err;
      attempts.push(`${provider}:${err.status ?? "network"}`);
      if (shouldThrowImmediately?.(err)) throw err;
      if (!isFailoverError(err)) throw err;
      if (attempt < total - 1) {
        console.warn(
          `[ai] ${provider} attempt ${attempt + 1}/${total} failed (${err.message}), retrying in a moment`
        );
        await delay(backoffDelay(attempt));
      }
    }
  }

  const exhausted = new AIProviderError(
    provider,
    `exhausted ${total} attempts`,
    429
  );
  exhausted.attempts = attempts;
  throw exhausted;
}
