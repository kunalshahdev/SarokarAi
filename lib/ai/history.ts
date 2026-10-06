import { HISTORY_CONFIG } from "./config";
import type { ChatMessage } from "./types";

export function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  // Keep the most recent messages, then drop the oldest until we're under the
  // character budget. The conversation must start with a user turn.
  const recent = messages.slice(-HISTORY_CONFIG.maxMessages);
  let totalChars = recent.reduce((sum, m) => sum + m.content.length, 0);

  let start = 0;
  while (
    start < recent.length - 1 &&
    (totalChars > HISTORY_CONFIG.maxChars || recent[start].role !== "user")
  ) {
    totalChars -= recent[start].content.length;
    start++;
  }

  const trimmed = recent.slice(start);
  // The newest message alone may still exceed the budget; it's already capped
  // per-message upstream, so send it rather than nothing.
  return trimmed.length > 0 ? trimmed : messages.slice(-1);
}

export function estimateTokens(messages: ChatMessage[]): number {
  const chars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(chars / 4);
}
