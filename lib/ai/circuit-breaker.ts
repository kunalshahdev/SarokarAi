// Circuit breaker for AI providers.
//
// When a provider keeps failing we stop trying it for a cooldown period so
// requests fail over instantly instead of paying the retry cost every time.
// After the cooldown expires the next request probes the provider again
// (half-open): success closes the breaker, failure re-opens it.

interface BreakerState {
  consecutiveFailures: number;
  openUntil: number;
}

const store = new Map<string, BreakerState>();

export interface CircuitBreakerConfig {
  failureThreshold: number;
  cooldownMs: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: envPositiveInt("AI_BREAKER_THRESHOLD", 3),
  cooldownMs: envPositiveInt("AI_BREAKER_COOLDOWN_MS", 5 * 60 * 1000),
};

function envPositiveInt(name: string, fallback: number): number {
  const raw = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

export function isProviderAvailable(
  providerId: string,
  now: number = Date.now()
): boolean {
  const state = store.get(providerId);
  if (!state) return true;
  return now >= state.openUntil;
}

export function recordProviderSuccess(providerId: string): void {
  store.delete(providerId);
}

export function recordProviderFailure(
  providerId: string,
  config: Partial<CircuitBreakerConfig> = {},
  now: number = Date.now()
): void {
  const { failureThreshold, cooldownMs } = { ...DEFAULT_CONFIG, ...config };
  const state = store.get(providerId) ?? {
    consecutiveFailures: 0,
    openUntil: 0,
  };
  state.consecutiveFailures += 1;
  if (state.consecutiveFailures >= failureThreshold) {
    state.openUntil = now + cooldownMs;
    console.warn(
      `[ai] circuit breaker OPEN for ${providerId} for ${Math.round(cooldownMs / 1000)}s after ${state.consecutiveFailures} failures`
    );
  }
  store.set(providerId, state);
}

export function resetBreakers(): void {
  store.clear();
}
