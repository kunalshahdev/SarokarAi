import { describe, expect, it } from "vitest";
import { findTopic, findTopicInHistory } from "./topics";

describe("findTopic", () => {
  it("matches aliases in Roman Nepali and Devanagari", () => {
    expect(findTopic("pan card kasari banaune?")?.id).toBe("pan");
    expect(findTopic("जन्म दर्ता कहाँ गर्ने")?.id).toBe("birth-marriage-cert");
  });

  it("does not match short aliases inside other words", () => {
    expect(findTopic("I panicked at the office")?.id).not.toBe("pan");
  });
});

describe("findTopicInHistory", () => {
  it("carries the topic into a follow-up that doesn't name it", () => {
    const messages = [
      { role: "user", content: "passport renew kasari garne?" },
      { role: "assistant", content: "..." },
      { role: "user", content: "kati din lagcha?" },
    ];
    expect(findTopicInHistory(messages)?.id).toBe("passport");
  });

  it("ignores the latest message and bad input", () => {
    expect(findTopicInHistory([{ role: "user", content: "pan card" }])).toBeUndefined();
    expect(findTopicInHistory("nope")).toBeUndefined();
  });
});
