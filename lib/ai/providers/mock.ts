import { AIProviderError } from "../errors";
import type { AIProvider, ChatMessage, StreamChatOptions } from "../types";

type MockScenario = "ok" | "rate_limit_once" | "always_429" | "always_500";

const MOCK_REPLY =
  "Hajur, ma mock provider ho — tapaiko question aayo: \"{{last}}\". " +
  "Yo reply real AI hoina, tara streaming ra fallback path test garna kaam garcha. " +
  "Aaja kasto din bhitairacha? Aru kehi sodhna saknu hunchha.";

let callCount = 0;

function scenario(): MockScenario {
  const raw = (process.env.AI_MOCK_SCENARIO || "ok").toLowerCase();
  if (
    raw === "rate_limit_once" ||
    raw === "always_429" ||
    raw === "always_500"
  ) {
    return raw;
  }
  return "ok";
}

function fail(scenarioName: MockScenario): never {
  callCount++;
  if (scenarioName === "always_429" || scenarioName === "rate_limit_once") {
    throw new AIProviderError("mock", "mock rate limit", 429);
  }
  throw new AIProviderError("mock", "mock upstream outage", 503);
}

export const mockProvider: AIProvider = {
  id: "mock",

  isConfigured(): boolean {
    return true;
  },

  async streamChat(messages: ChatMessage[], options: StreamChatOptions) {
    const scenarioName = scenario();
    const shouldSucceed =
      scenarioName === "ok" ||
      (scenarioName === "rate_limit_once" && callCount >= 1);

    if (!shouldSucceed) {
      fail(scenarioName);
    }

    callCount++;
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const text = MOCK_REPLY.replace(
      "{{last}}",
      lastUser.slice(0, 120)
    );

    async function* generate(): AsyncGenerator<string> {
      await new Promise((r) => setTimeout(r, 150));
      const words = text.split(" ");
      for (const word of words) {
        if (options.signal?.aborted) return;
        yield word + " ";
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    return generate();
  },
};

export function resetMockProvider(): void {
  callCount = 0;
}
