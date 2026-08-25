import { DEFAULTS } from "../config";
import type { AIProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";

export const cerebrasProvider: AIProvider = createOpenAICompatibleProvider({
  id: "cerebras",
  apiUrl: "https://api.cerebras.ai/v1/chat/completions",
  apiKeyEnv: "CEREBRAS_API_KEY",
  model: () => DEFAULTS.cerebrasModel,
});
