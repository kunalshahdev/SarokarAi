import { HISTORY_CONFIG } from "./config";
import type { ChatMessage } from "./types";

function dropLeadingAssistant(messages: ChatMessage[]): ChatMessage[] {
  let start = 0;
  while (start < messages.length && messages[start].role !== "user") {
    start++;
  }
  return start < messages.length ? messages.slice(start) : messages.slice(-1);
}

export function trimHistory(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= HISTORY_CONFIG.maxMessages) {
    return startsWithUser(messages)
      ? messages
      : dropLeadingAssistant(messages);
  }

  const recent = messages.slice(-HISTORY_CONFIG.maxMessages);
  let totalChars = recent.reduce((sum, m) => sum + m.content.length, 0);

  let start = 0;
  while (
    start < recent.length &&
    (totalChars > HISTORY_CONFIG.maxChars || !startsWithUser(recent.slice(start)))
  ) {
    totalChars -= recent[start].content.length;
    start++;
  }

  const trimmed = recent.slice(start);
  return trimmed.length > 0 ? trimmed : messages.slice(-1);
}

function startsWithUser(messages: ChatMessage[]): boolean {
  return messages.length > 0 && messages[0].role === "user";
}

export function estimateTokens(messages: ChatMessage[]): number {
  const chars = messages.reduce((sum, m) => sum + m.content.length, 0);
  return Math.ceil(chars / 4);
}
