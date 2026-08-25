import { describe, expect, it } from "vitest";
import { extractJson } from "./summary-json";

describe("extractJson", () => {
  it("parses a clean JSON object", () => {
    const raw = JSON.stringify({
      tldr: "k bhayo",
      keyPoints: ["point 1", "point 2"],
      whyItMatters: "important cha",
    });
    const parsed = extractJson(raw);
    expect(parsed?.tldr).toBe("k bhayo");
    expect(parsed?.keyPoints).toEqual(["point 1", "point 2"]);
    expect(parsed?.whyItMatters).toBe("important cha");
  });

  it("strips markdown fences", () => {
    const raw = '```json\n{"tldr":"x","keyPoints":["a"],"whyItMatters":"y"}\n```';
    expect(extractJson(raw)?.tldr).toBe("x");
  });

  it("handles surrounding commentary", () => {
    const raw = 'Here you go:\n{"tldr":"x","keyPoints":[]} hope this helps!';
    expect(extractJson(raw)?.tldr).toBe("x");
  });

  it("caps key points at 5 and drops non-strings", () => {
    const raw = JSON.stringify({
      tldr: "x",
      keyPoints: ["1", 2, null, "3", "4", "5", "6"],
      whyItMatters: "y",
    });
    expect(extractJson(raw)?.keyPoints).toEqual(["1", "3", "4", "5", "6"]);
  });

  it("defaults missing whyItMatters to empty string", () => {
    const raw = '{"tldr":"x","keyPoints":["a"]}';
    expect(extractJson(raw)?.whyItMatters).toBe("");
  });

  it("returns null on invalid input shapes", () => {
    expect(extractJson("no json here")).toBeNull();
    expect(extractJson('{"keyPoints":[]}')).toBeNull(); // tldr missing
    expect(extractJson('{"tldr":"x"}')).toBeNull(); // keyPoints missing
    expect(extractJson('{"tldr":"x","keyPoints":["a"')).toBeNull(); // broken JSON
    expect(extractJson("")).toBeNull();
  });
});
