import { createHash } from "node:crypto";

// Small in-memory cache for first-turn answers ("PAN kasari banaune?").
// Popular questions get answered instantly and don't spend AI provider quota.
//
// Only fresh conversations (a single user message) are cached: follow-ups
// depend on history and are always sent to the model. The key includes the
// full system prompt, so anything that changes the prompt — topic context,
// K Cha Ta mode, the live news context, today's date — naturally misses.
//
// Note: the cache lives per server instance. On serverless hosting each
// instance warms its own copy, which is fine for a best-effort cache.

const MAX_ENTRIES = 500;

interface Entry {
  text: string;
  expiresAt: number;
}

const store = new Map<string, Entry>();

export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[?!.,।]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function answerCacheKey(systemPrompt: string, question: string): string {
  return createHash("sha256")
    .update(systemPrompt)
    .update("\u0000")
    .update(normalizeQuestion(question))
    .digest("hex");
}

export function getCachedAnswer(key: string, now = Date.now()): string | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (now > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  // Refresh recency so popular answers survive eviction.
  store.delete(key);
  store.set(key, entry);
  return entry.text;
}

export function setCachedAnswer(
  key: string,
  text: string,
  ttlMs: number,
  now = Date.now()
): void {
  if (!text.trim() || ttlMs <= 0) return;
  store.delete(key);
  store.set(key, { text, expiresAt: now + ttlMs });
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

export function clearAnswerCache(): void {
  store.clear();
}
