import { afterEach, describe, expect, it, vi } from "vitest";

async function loadConfig(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v as string);
  return import("./config");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("usage limits", () => {
  it("has no daily or per-IP cap by default", async () => {
    const cfg = await loadConfig({});
    for (const tier of ["guest", "user", "premium"] as const) {
      expect(cfg.isLimitEnabled(cfg.AI_LIMITS[tier].daily)).toBe(false);
    }
    expect(cfg.isLimitEnabled(cfg.IP_HOURLY_LIMIT)).toBe(false);
  });

  it("keeps a burst guard a human won't hit", async () => {
    const cfg = await loadConfig({});
    expect(cfg.AI_LIMITS.guest.burstPerMinute).toBeGreaterThanOrEqual(20);
  });

  it("lets an operator turn caps back on via env", async () => {
    const cfg = await loadConfig({
      AI_GUEST_DAILY_LIMIT: "50",
      AI_IP_HOURLY_LIMIT: "500",
    });
    expect(cfg.AI_LIMITS.guest.daily).toBe(50);
    expect(cfg.IP_HOURLY_LIMIT).toBe(500);
  });

  it("treats 0 as unlimited and ignores garbage", async () => {
    const cfg = await loadConfig({
      AI_GUEST_BURST_PER_MINUTE: "0",
      AI_USER_DAILY_LIMIT: "abc",
    });
    expect(cfg.isLimitEnabled(cfg.AI_LIMITS.guest.burstPerMinute)).toBe(false);
    expect(cfg.AI_LIMITS.user.daily).toBe(0);
  });
});
