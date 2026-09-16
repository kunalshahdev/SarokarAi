import { beforeEach, describe, expect, it } from "vitest";
import {
  isProviderAvailable,
  recordProviderFailure,
  recordProviderSuccess,
  resetBreakers,
} from "./circuit-breaker";

const T0 = new Date("2026-01-01T00:00:00Z").getTime();

describe("circuit breaker", () => {
  beforeEach(() => resetBreakers());

  it("starts available", () => {
    expect(isProviderAvailable("p", T0)).toBe(true);
  });

  it("stays available below the failure threshold", () => {
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    expect(isProviderAvailable("p", T0)).toBe(true);
  });

  it("opens after consecutive failures and closes after cooldown", () => {
    const cooldownMs = 5 * 60_000;
    recordProviderFailure("p", { failureThreshold: 3, cooldownMs }, T0);
    recordProviderFailure("p", { failureThreshold: 3, cooldownMs }, T0);
    recordProviderFailure("p", { failureThreshold: 3, cooldownMs }, T0);

    expect(isProviderAvailable("p", T0 + 1000)).toBe(false);

    // half-open probe after cooldown
    expect(isProviderAvailable("p", T0 + cooldownMs + 1)).toBe(true);

    // probe fails -> re-opens immediately
    recordProviderFailure("p", { failureThreshold: 3, cooldownMs }, T0 + cooldownMs + 2);
    expect(isProviderAvailable("p", T0 + cooldownMs + 3000)).toBe(false);
  });

  it("success resets the failure counter", () => {
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    recordProviderSuccess("p");
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    recordProviderFailure("p", { failureThreshold: 3 }, T0);
    expect(isProviderAvailable("p", T0)).toBe(true);
  });

  it("tracks providers independently", () => {
    recordProviderFailure("a", { failureThreshold: 1, cooldownMs: 60_000 }, T0);
    expect(isProviderAvailable("a", T0 + 1)).toBe(false);
    expect(isProviderAvailable("b", T0 + 1)).toBe(true);
  });
});
