import { describe, expect, it } from "vitest";
import {
  AIProviderError,
  AllProvidersFailedError,
  classifyProviderError,
  isFailoverError,
} from "./errors";

describe("classifyProviderError", () => {
  it("flags 429 and quota text as rate limiting", () => {
    expect(classifyProviderError("p", 429, "").message).toMatch(/rate limited/i);
    expect(classifyProviderError("p", 403, "resource exhausted").status).toBe(403);
  });

  it("marks transient upstream statuses", () => {
    for (const status of [408, 425, 500, 502, 503, 504]) {
      const err = classifyProviderError("p", status, "");
      expect(err.status).toBe(status);
      expect(isFailoverError(err)).toBe(true);
    }
  });

  it("treats auth failures as failover-worthy (bad key should not kill request)", () => {
    for (const status of [401, 403]) {
      expect(isFailoverError(classifyProviderError("p", status, ""))).toBe(true);
    }
  });

  it("non-failover statuses (4xx) throw immediately", () => {
    expect(isFailoverError(classifyProviderError("p", 400, "bad"))).toBe(false);
    expect(isFailoverError(classifyProviderError("p", 422, "bad"))).toBe(false);
  });
});

describe("error types", () => {
  it("AIProviderError carries provider and status", () => {
    const err = new AIProviderError("groq", "boom", 500);
    expect(err.provider).toBe("groq");
    expect(err.status).toBe(500);
    expect(err instanceof Error).toBe(true);
  });

  it("AllProvidersFailedError records attempts", () => {
    const err = new AllProvidersFailedError(["a:429", "b:network"]);
    expect(err.attempts).toEqual(["a:429", "b:network"]);
  });
});
