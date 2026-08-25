import { DEFAULTS } from "../config";
import type { AIProvider } from "../types";
import { createOpenAICompatibleProvider } from "./openai-compatible";

export const groqProvider: AIProvider = createOpenAICompatibleProvider({
  id: "groq",
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  apiKeyEnv: "GROQ_API_KEY",
  model: () => DEFAULTS.groqModel,
});
