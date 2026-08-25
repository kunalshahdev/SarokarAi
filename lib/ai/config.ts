function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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

export const AI_LIMITS: Record<"guest" | "user" | "premium", TierLimit> = {
  guest: {
    daily: envInt("AI_GUEST_DAILY_LIMIT", 15),
    burstPerMinute: envInt("AI_GUEST_BURST_PER_MINUTE", 8),
  },
  user: {
    daily: envInt("AI_USER_DAILY_LIMIT", 20),
    burstPerMinute: envInt("AI_USER_BURST_PER_MINUTE", 12),
  },
  premium: {
    daily: envInt("AI_PREMIUM_DAILY_LIMIT", 100),
    burstPerMinute: envInt("AI_PREMIUM_BURST_PER_MINUTE", 30),
  },
};

export const IP_HOURLY_LIMIT = envInt("AI_IP_HOURLY_LIMIT", 60);

export const PROVIDER_ORDER = envList("AI_PROVIDER_ORDER", [
  "gemini",
  "groq",
  "cerebras",
  "openrouter",
]);

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
