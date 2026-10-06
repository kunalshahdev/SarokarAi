function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Like envInt, but "0" is allowed and means "no limit".
function envLimit(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/** A limit of 0 means the check is switched off. */
export function isLimitEnabled(limit: number): boolean {
  return limit > 0;
}

function envList(name: string, fallback: string[]): string[] {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return parts.length > 0 ? parts : fallback;
}

export interface TierLimit {
  daily: number;
  burstPerMinute: number;
}

// Usage limits. 0 = unlimited.
// Daily caps are OFF by default so people can use Sarokar freely. The only
// guard left on is a per-minute burst limit that a human typing questions
// never reaches — it just stops scripts from draining the AI providers' quota.
export const AI_LIMITS: Record<"guest" | "user" | "premium", TierLimit> = {
  guest: {
    daily: envLimit("AI_GUEST_DAILY_LIMIT", 0),
    burstPerMinute: envLimit("AI_GUEST_BURST_PER_MINUTE", 20),
  },
  user: {
    daily: envLimit("AI_USER_DAILY_LIMIT", 0),
    burstPerMinute: envLimit("AI_USER_BURST_PER_MINUTE", 20),
  },
  premium: {
    daily: envLimit("AI_PREMIUM_DAILY_LIMIT", 0),
    burstPerMinute: envLimit("AI_PREMIUM_BURST_PER_MINUTE", 30),
  },
};

// Per-IP hourly guard. Off by default: Nepali mobile networks put many users
// behind one shared IP (CGNAT), so an IP cap blocks innocent people.
export const IP_HOURLY_LIMIT = envLimit("AI_IP_HOURLY_LIMIT", 0);

export const PROVIDER_ORDER = envList("AI_PROVIDER_ORDER", [
  "groq",
  "gemini",
  "cerebras",
  "openrouter",
]);

export const QUOTA_BREAKER_COOLDOWN_MS = envInt(
  "AI_QUOTA_BREAKER_COOLDOWN_MS",
  5 * 60 * 1000
);

export const RETRY_CONFIG = {
  maxRetriesPerProvider: envInt("AI_MAX_RETRIES_PER_PROVIDER", 2),
  baseDelayMs: envInt("AI_RETRY_BASE_DELAY_MS", 300),
  maxDelayMs: envInt("AI_RETRY_MAX_DELAY_MS", 1500),
};

export const HISTORY_CONFIG = {
  maxMessages: envInt("AI_HISTORY_MAX_MESSAGES", 12),
  maxChars: envInt("AI_HISTORY_MAX_CHARS", 6000),
};

export const REQUEST_CONFIG = {
  maxMessages: 50,
  maxMessageLength: 5000,
  upstreamTimeoutMs: envInt("AI_UPSTREAM_TIMEOUT_MS", 30_000),
};

export const DEFAULTS = {
  temperature: 0.7,
  maxOutputTokens: envInt("AI_MAX_OUTPUT_TOKENS", 3072),
  geminiModel: process.env.GEMINI_MODEL || "gemini-3.6-flash",
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  cerebrasModel: process.env.CEREBRAS_MODEL || "gpt-oss-120b",
  openRouterModel:
    process.env.OPENROUTER_MODEL ||
    "nvidia/nemotron-3-super-120b-a12b:free",
};

export const MOCK_PROVIDER_ENABLED =
  process.env.AI_ENABLE_MOCK_PROVIDER === "1" &&
  process.env.NODE_ENV !== "production";

export function resolveTier(userId?: string | null): "guest" | "user" | "premium" {
  if (!userId) return "guest";
  return "user";
}
