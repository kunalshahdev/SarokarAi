import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkRateLimit,
  getClientIdentifier,
  peekRateLimit,
  resetRateLimits,
} from "./rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    resetRateLimits();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit then blocks", () => {
    const cfg = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimit("u1", cfg).allowed).toBe(true);
    expect(checkRateLimit("u1", cfg).allowed).toBe(true);
    const third = checkRateLimit("u1", cfg);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const blocked = checkRateLimit("u1", cfg);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it("does not count blocked attempts against the quota", () => {
    const cfg = { limit: 1, windowMs: 60_000 };
    checkRateLimit("u2", cfg);
    for (let i = 0; i < 5; i++) checkRateLimit("u2", cfg);
    // window passes
    vi.setSystemTime(new Date("2026-01-01T00:02:00Z"));
    expect(checkRateLimit("u2", cfg).allowed).toBe(true);
  });

  it("resets after the window elapses", () => {
    const cfg = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("u3", cfg).allowed).toBe(true);
    expect(checkRateLimit("u3", cfg).allowed).toBe(false);
    // strictly past the window boundary
    vi.setSystemTime(new Date("2026-01-01T00:01:01Z"));
    const again = checkRateLimit("u3", cfg);
    expect(again.allowed).toBe(true);
    expect(again.remaining).toBe(0);
  });

  it("keeps buckets isolated per identifier", () => {
    const cfg = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("a", cfg).allowed).toBe(true);
    expect(checkRateLimit("b", cfg).allowed).toBe(true);
  });

  it("peek does not consume quota", () => {
    const cfg = { limit: 2, windowMs: 60_000 };
    peekRateLimit("u4", cfg);
    peekRateLimit("u4", cfg);
    expect(checkRateLimit("u4", cfg).remaining).toBe(1);
  });

  it("getClientIdentifier prefers x-forwarded-for first IP", () => {
    const req = new Request("https://x.dev", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIdentifier(req)).toBe("1.2.3.4");
  });

  it("falls back to a UA hash when no IP headers exist", () => {
    const req = new Request("https://x.dev", { headers: {} });
    const id = getClientIdentifier(req);
    expect(id.startsWith("fallback-")).toBe(true);
  });
});
