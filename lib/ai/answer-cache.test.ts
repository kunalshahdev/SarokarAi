import { beforeEach, describe, expect, it } from "vitest";
import {
  answerCacheKey,
  clearAnswerCache,
  getCachedAnswer,
  setCachedAnswer,
} from "./answer-cache";

beforeEach(() => clearAnswerCache());

describe("answer cache", () => {
  it("matches the same question despite case and punctuation", () => {
    expect(answerCacheKey("sys", "PAN kasari banaune?")).toBe(
      answerCacheKey("sys", "  pan kasari   banaune ")
    );
  });

  it("misses when the system prompt differs (mode, topic, news context)", () => {
    expect(answerCacheKey("sys-a", "q")).not.toBe(answerCacheKey("sys-b", "q"));
  });

  it("returns stored answers until they expire", () => {
    const key = answerCacheKey("sys", "q");
    setCachedAnswer(key, "answer", 1000, 0);
    expect(getCachedAnswer(key, 500)).toBe("answer");
    expect(getCachedAnswer(key, 1500)).toBeNull();
  });

  it("does not store empty answers", () => {
    const key = answerCacheKey("sys", "q");
    setCachedAnswer(key, "   ", 1000);
    expect(getCachedAnswer(key)).toBeNull();
  });
});
