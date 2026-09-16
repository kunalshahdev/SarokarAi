export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SafetySetting {
  category: string;
  threshold: string;
}

export interface StreamChatOptions {
  systemPrompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  safetySettings?: SafetySetting[];
  signal?: AbortSignal;
}

export interface AIProvider {
  readonly id: string;
  isConfigured(): boolean;
  streamChat(
    messages: ChatMessage[],
    options: StreamChatOptions
  ): Promise<AsyncIterable<string>>;
}
