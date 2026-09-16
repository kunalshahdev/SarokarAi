export async function* sseDataPayloads(
  response: Response,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const body = response.body;
  if (!body) return;

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const payload = extractPayload(line);
        if (payload !== null) yield payload;
      }
    }
    if (buffer.trim()) {
      const payload = extractPayload(buffer);
      if (payload !== null) yield payload;
    }
  } finally {
    reader.releaseLock();
    try {
      await reader.cancel().catch(() => {});
    } catch {}
  }
}

function extractPayload(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith("data:")) return null;
  return trimmed.slice(5).trim();
}
