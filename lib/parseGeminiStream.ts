import { TextEncoder, TextDecoder } from "util";

export interface StreamCallbacks {
  onText: (text: string) => void;
  onError?: (error: Error) => void;
}

export function parseGeminiSSEStream(
  body: ReadableStream<Uint8Array> | null,
  callbacks: StreamCallbacks
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const reader = body?.getReader();
      if (!reader) {
        controller.enqueue(encoder.encode(JSON.stringify({ text: "" }) + "\n"));
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleaned = line.replace(/^data:\s*/, "").trim();
            if (!cleaned) continue;

            try {
              const chunk = JSON.parse(cleaned);
              const text =
                chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                callbacks.onText(text);
                controller.enqueue(
                  encoder.encode(JSON.stringify({ text }) + "\n")
                );
              }
            } catch {
              // Skip malformed chunks silently
            }
          }
        }

        // Process remaining buffer
        if (buffer.trim()) {
          const cleaned = buffer.replace(/^data:\s*/, "").trim();
          if (cleaned) {
            try {
              const chunk = JSON.parse(cleaned);
              const text =
                chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (text) {
                callbacks.onText(text);
                controller.enqueue(
                  encoder.encode(JSON.stringify({ text }) + "\n")
                );
              }
            } catch {
              // Skip malformed trailing chunk
            }
          }
        }
      } catch (err) {
        callbacks.onError?.(err as Error);
      }

      controller.close();
    },
  });
}
