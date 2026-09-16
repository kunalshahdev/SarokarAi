import { DEFAULTS } from "../config";
import type { AIProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";

export const openRouterProvider: AIProvider = createOpenAICompatibleProvider({
  id: "openrouter",
  apiUrl: "https://openrouter.ai/api/v1/chat/completions",
  apiKeyEnv: "OPENROUTER_API_KEY",
  model: () => DEFAULTS.openRouterModel,
  extraHeaders: {
    // Optional attribution headers recommended by OpenRouter.
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://sarokar.app",
    "X-Title": "Sarokar",
  },
});
