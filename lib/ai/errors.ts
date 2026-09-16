export class AIProviderError extends Error {
  readonly provider: string;
  readonly status?: number;
  attempts?: string[];

  constructor(provider: string, message: string, status?: number) {
    super(message);
    this.name = "AIProviderError";
    this.provider = provider;
    this.status = status;
  }
}

const FAILOVER_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

export function classifyProviderError(
  provider: string,
  status: number,
  body: string
): AIProviderError {
  if (status === 429 || /quota|rate.?limit|resource.?exhausted/i.test(body)) {
    return new AIProviderError(
      provider,
      `rate limited or quota exceeded (${status})`,
      status
    );
  }
  if (FAILOVER_STATUSES.has(status)) {
    return new AIProviderError(provider, `upstream error ${status}`, status);
  }
  if (status === 401 || status === 403) {
    return new AIProviderError(
      provider,
      `authentication rejected (${status})`,
      status
    );
  }
  return new AIProviderError(
    provider,
    `request rejected (${status}): ${body.slice(0, 300)}`,
    status
  );
}

export function isFailoverError(err: AIProviderError): boolean {
  if (err.status === undefined) return true;
  return (
    FAILOVER_STATUSES.has(err.status) ||
    err.status === 401 ||
    err.status === 403
  );
}

export class AllProvidersFailedError extends Error {
  readonly attempts: string[];

  constructor(attempts: string[]) {
    super("all AI providers failed");
    this.name = "AllProvidersFailedError";
    this.attempts = attempts;
  }
}
