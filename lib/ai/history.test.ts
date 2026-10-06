import { describe, expect, it } from "vitest";
import { HISTORY_CONFIG } from "./config";
import { trimHistory } from "./history";
import type { ChatMessage } from "./types";

const u = (content: string): ChatMessage => ({ role: "user", content });
const a = (content: string): ChatMessage => ({ role: "assistant", content });

describe("trimHistory", () => {
  it("leaves a short conversation alone", () => {
    const msgs = [u("hi"), a("hello"), u("pan kasari?")];
    expect(trimHistory(msgs)).toEqual(msgs);
  });

  it("enforces the character budget even for short conversations", () => {
    const big = "x".repeat(HISTORY_CONFIG.maxChars);
    const msgs = [u(big), a(big), u("follow up")];
    const out = trimHistory(msgs);
    const chars = out.reduce((n, m) => n + m.content.length, 0);
    expect(chars).toBeLessThanOrEqual(HISTORY_CONFIG.maxChars);
    expect(out.at(-1)).toEqual(u("follow up"));
  });

  it("always starts with a user turn", () => {
    const msgs = [a("welcome"), u("q1"), a("a1"), u("q2")];
    expect(trimHistory(msgs)[0].role).toBe("user");
  });

  it("caps the number of messages", () => {
    const msgs: ChatMessage[] = [];
    for (let i = 0; i < 40; i++) msgs.push(i % 2 ? a(`a${i}`) : u(`q${i}`));
    msgs.push(u("last"));
    const out = trimHistory(msgs);
    expect(out.length).toBeLessThanOrEqual(HISTORY_CONFIG.maxMessages);
    expect(out.at(-1)?.content).toBe("last");
  });

  it("still sends the latest message when it alone is over budget", () => {
    const huge = "y".repeat(HISTORY_CONFIG.maxChars + 100);
    expect(trimHistory([u(huge)])).toEqual([u(huge)]);
  });
});
