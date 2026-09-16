interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();
const MAX_MAP_SIZE = 10000;

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSec: number;
}

function bucketKey(
  identifier: string,
  { limit, windowMs }: RateLimitConfig
): string {
  return `${identifier}|${limit}|${windowMs}`;
}

function cleanupExpired(now: number): void {
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

function currentEntry(key: string, config: RateLimitConfig, now: number): Entry | undefined {
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) return undefined;
  return entry;
}

export function peekRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = bucketKey(identifier, config);
  const entry = currentEntry(key, config, now);
  const used = entry ? entry.count : 0;
  const resetAt = entry ? entry.resetAt : now + config.windowMs;
  const remaining = Math.max(0, config.limit - used);
  return {
    allowed: remaining > 0,
    remaining,
    limit: config.limit,
    resetAt,
    retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

export function recordHit(identifier: string, config: RateLimitConfig): void {
  const now = Date.now();
  const key = bucketKey(identifier, config);
  const entry = currentEntry(key, config, now);

  if (!entry) {
    if (store.size > MAX_MAP_SIZE) cleanupExpired(now);
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return;
  }
  entry.count++;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const result = peekRateLimit(identifier, config);
  if (!result.allowed) return result;
  recordHit(identifier, config);
  // Report quota truthfully *after* consuming this request.
  return { ...result, remaining: Math.max(0, result.remaining - 1) };
}

export function resetRateLimits(): void {
  store.clear();
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept-language") || "";
  return `fallback-${hashCode(ua + accept)}`;
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
