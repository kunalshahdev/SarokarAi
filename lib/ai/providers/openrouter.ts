import { DEFAULTS } from "../config";
import type { AIProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";
import { getSiteUrl } from "@/lib/site-url";

export const openRouterProvider: AIProvider = createOpenAICompatibleProvider({
  id: "openrouter",
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  apiKeyEnv: "OPENROUTER_API_KEY",
  model: () => DEFAULTS.openRouterModel,
  extraHeaders: {
    // Optional attribution headers recommended by OpenRouter.
    "HTTP-Referer": getSiteUrl(),
    "X-Title": "Sarokar",
  },
});
