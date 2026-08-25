import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AIProvider } from "./types";
import { AIProviderError, AllProvidersFailedError } from "./errors";
import {
  isProviderAvailable,
  recordProviderFailure,
  resetBreakers,
} from "./circuit-breaker";

// PROVIDER_ORDER is read from env at module load. Set it once, before the
// first dynamic import, so the module under test shares this file's module
// registry (keeps instanceof checks working).
process.env.AI_PROVIDER_ORDER =
  "first,limited,missing,dead,only,fallback,healthy,alive,second";
const { chatWithFallback } = await import("./provider");

function fakeProvider(
  id: string,
  behavior: () => AsyncIterable<string> | Promise<AsyncIterable<string>>
): AIProvider {
  return {
    id,
    isConfigured: () => true,
    streamChat: async () => behavior(),
  };
}

const okStream = async function* () {
  yield "hello";
};

describe("chatWithFallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetBreakers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.AI_PROVIDER_ORDER;
  });

  function run(promise: Promise<unknown>) {
    // withRetries sleeps between attempts; advance past all backoff windows.
    return Promise.all([promise, vi.advanceTimersByTimeAsync(10_000)]);
  }

  it("returns the first healthy provider in order", async () => {
    const calls: string[] = [];
    const registry: Record<string, AIProvider> = {
      first: fakeProvider("first", async () => {
        calls.push("first");
        return okStream();
      }),
      second: fakeProvider("second", async () => {
        calls.push("second");
        return okStream();
      }),
    };

    const result = await chatWithFallback(
      [{ role: "user", content: "hi" }],
      { systemPrompt: "sys" },
      registry
    );
    expect(result.providerId).toBe("first");
    expect(calls).toEqual(["first"]);
  });

  it("fails over to the next provider when one is rate limited", async () => {
    let limitedCalls = 0;
    const registry: Record<string, AIProvider> = {
      limited: fakeProvider("limited", async () => {
        limitedCalls++;
        throw new AIProviderError("limited", "rate limited or quota exceeded (429)", 429);
      }),
      healthy: fakeProvider("healthy", () => okStream()),
    };

    const result = (await run(
      chatWithFallback([{ role: "user", content: "hi" }], { systemPrompt: "s" }, registry)
    ))[0] as { providerId: string };

    expect(limitedCalls).toBeGreaterThan(1); // retried before giving up
    expect(result.providerId).toBe("healthy");
  });

  it("skips unconfigured providers", async () => {
    const registry: Record<string, AIProvider> = {
      missing: {
        id: "missing",
        isConfigured: () => false,
        streamChat: async () => okStream(),
      },
      fallback: fakeProvider("fallback", () => okStream()),
    };

    const result = await chatWithFallback(
      [{ role: "user", content: "hi" }],
      { systemPrompt: "s" },
      registry
    );
    expect(result.providerId).toBe("fallback");
  });

  it("skips providers whose circuit breaker is open", async () => {
    const registry: Record<string, AIProvider> = {
      dead: fakeProvider("dead", () => okStream()),
      alive: fakeProvider("alive", () => okStream()),
    };

    // Trip the breaker for "dead".
    for (let i = 0; i < 3; i++) {
      recordProviderFailure("dead", { failureThreshold: 3 }, Date.now());
    }
    expect(isProviderAvailable("dead")).toBe(false);

    const result = await chatWithFallback(
      [{ role: "user", content: "hi" }],
      { systemPrompt: "s" },
      registry
    );
    expect(result.providerId).toBe("alive");

    // Now everything fails; the attempt log must show the breaker skip.
    const err = (await run(
      chatWithFallback([{ role: "user", content: "hi" }], { systemPrompt: "s" }, {
        dead: fakeProvider("dead", () => okStream()),
        alive: fakeProvider("alive", () => {
          throw new AIProviderError("alive", "upstream error 503", 503);
        }),
      })
    ).catch((e) => e)) as AllProvidersFailedError;

    expect(err.attempts).toContain("dead:breaker-open");
  });

  it("throws AllProvidersFailedError when every provider fails", async () => {
    const registry: Record<string, AIProvider> = {
      only: fakeProvider("only", async () => {
        throw new AIProviderError("only", "rate limited (429)", 429);
      }),
    };

    const err = await run(
      chatWithFallback([{ role: "user", content: "hi" }], { systemPrompt: "s" }, registry)
    ).then(([r]) => r).catch((e) => e);

    expect(err).toBeInstanceOf(AllProvidersFailedError);
    expect((err as AllProvidersFailedError).attempts.length).toBeGreaterThan(0);
  });
});
