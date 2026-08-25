import { NextRequest, NextResponse } from "next/server";
import {
  AI_LIMITS,
  IP_HOURLY_LIMIT,
  REQUEST_CONFIG,
} from "./config";
import { AllProvidersFailedError, AIProviderError } from "./errors";
import { trimHistory } from "./history";
import { FRIENDLY_MESSAGES } from "./messages";
import { chatWithFallback } from "./provider";
import { resolveSession, SessionContext } from "./session";
import {
  checkRateLimit,
  getClientIdentifier,
  peekRateLimit,
  recordHit,
} from "@/lib/rate-limit";
import type { ChatMessage, SafetySetting } from "./types";

export interface ChatHandlerOptions {
  prepare: (
    lastUserMessage: string,
    body: Record<string, unknown>
  ) =>
    | {
        systemPrompt: string;
        meta?: Record<string, unknown> | null;
      }
    | Promise<{
        systemPrompt: string;
        meta?: Record<string, unknown> | null;
      }>;
  safetySettings?: SafetySetting[];
  maxMessages?: number;
}

function sanitize(input: string): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .slice(0, REQUEST_CONFIG.maxMessageLength);
}

function jsonError(
  status: number,
  code: string,
  friendlyMessage: string,
  extraHeaders?: HeadersInit
): NextResponse {
  return NextResponse.json(
    { error: friendlyMessage, code },
    { status, headers: extraHeaders }
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function handleChatRequest(
  request: NextRequest,
  options: ChatHandlerOptions
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "invalid_json", FRIENDLY_MESSAGES.invalidRequest);
  }

  const { messages: rawMessages } = (body ?? {}) as { messages?: unknown };
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return jsonError(
      400,
      "invalid_messages",
      FRIENDLY_MESSAGES.invalidRequest
    );
  }

  const maxMessages = options.maxMessages ?? REQUEST_CONFIG.maxMessages;
  if (rawMessages.length > maxMessages) {
    return jsonError(400, "too_many_messages", `Too many messages. Maximum is ${maxMessages}.`);
  }

  for (const msg of rawMessages) {
    const role = (msg as { role?: unknown })?.role;
    const content = (msg as { content?: unknown })?.content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return jsonError(400, "invalid_message", FRIENDLY_MESSAGES.invalidRequest);
    }
    if (content.length > REQUEST_CONFIG.maxMessageLength) {
      return jsonError(
        400,
        "message_too_long",
        `Each message must be under ${REQUEST_CONFIG.maxMessageLength} characters.`
      );
    }
  }

  const messages: ChatMessage[] = rawMessages.map((m) => {
    const { role, content } = m as { role: "user" | "assistant"; content: string };
    return { role, content: sanitize(content) };
  });

  const session = resolveSession(request);
  const limits = AI_LIMITS[session.tier];
  const ip = getClientIdentifier(request);

  const ipCheck = checkRateLimit(`ipguard:${ip}`, {
    limit: IP_HOURLY_LIMIT,
    windowMs: 60 * 60 * 1000,
  });
  if (!ipCheck.allowed) {
    console.warn(`[limits] ip guard tripped for ${ip}`);
    return jsonError(
      429,
      "ip_rate_limited",
      FRIENDLY_MESSAGES.tooManyRequests,
      { "Retry-After": String(ipCheck.retryAfterSec) }
    );
  }

  const burstCheck = checkRateLimit(`${session.limitKey}:burst`, {
    limit: limits.burstPerMinute,
    windowMs: 60_000,
  });
  if (!burstCheck.allowed) {
    return limitedResponse(session, burstCheck.retryAfterSec, FRIENDLY_MESSAGES.tooManyRequests);
  }

  const dailyKey = `${session.limitKey}:daily`;
  const dailyCheck = peekRateLimit(dailyKey, {
    limit: limits.daily,
    windowMs: DAY_MS,
  });
  if (!dailyCheck.allowed) {
    return limitedResponse(
      session,
      dailyCheck.retryAfterSec,
      FRIENDLY_MESSAGES.dailyLimitReached
    );
  }

  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";

  try {
    const prepared = await options.prepare(lastUserMessage, (body ?? {}) as Record<string, unknown>);
    const result = await chatWithFallback(trimHistory(messages), {
      systemPrompt: prepared.systemPrompt,
      safetySettings: options.safetySettings,
      signal: request.signal,
    });

    recordHit(dailyKey, {
      limit: AI_LIMITS[session.tier].daily,
      windowMs: DAY_MS,
    });

    const encoder = new TextEncoder();
    const metaLine = prepared.meta ?? null;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        if (metaLine) {
          controller.enqueue(encoder.encode(JSON.stringify(metaLine) + "\n"));
        }
        try {
          for await (const delta of result.stream) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ text: delta }) + "\n")
            );
          }
        } catch (err) {
          console.error("[ai] mid-stream failure", err);
          try {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ error: FRIENDLY_MESSAGES.networkError }) + "\n"
              )
            );
          } catch {}
        }
        controller.close();
      },
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    };
    if (session.newCookie) headers["Set-Cookie"] = session.newCookie;

    return new Response(stream, { headers });
  } catch (err) {
    return mapProviderFailure(err);
  }
}

function limitedResponse(
  session: SessionContext,
  retryAfterSec: number,
  message: string
): NextResponse {
  const headers: Record<string, string> = {
    "Retry-After": String(Math.max(1, Math.min(retryAfterSec, 3600))),
  };
  if (session.newCookie) headers["Set-Cookie"] = session.newCookie;
  return NextResponse.json(
    {
      error: message,
      code: message === FRIENDLY_MESSAGES.dailyLimitReached ? "daily_limit_reached" : "rate_limited",
    },
    { status: 429, headers }
  );
}

export function mapProviderFailure(err: unknown): Response {
  if (err instanceof AllProvidersFailedError) {
    console.error("[ai] all providers failed", { attempts: err.attempts });
    const meaningful = err.attempts.filter(
      (a) => !a.endsWith(":not-configured") && !a.endsWith(":breaker-open")
    );
    const quotaExhausted =
      meaningful.length > 0 && meaningful.every((a) => a.endsWith(":429"));
    return jsonError(
      503,
      "providers_unavailable",
      quotaExhausted
        ? FRIENDLY_MESSAGES.allProvidersLimited
        : FRIENDLY_MESSAGES.serviceBusy
    );
  }
  if (err instanceof AIProviderError) {
    console.error("[ai] provider rejected request", {
      provider: err.provider,
      status: err.status,
      message: err.message,
    });
    return jsonError(503, "providers_unavailable", FRIENDLY_MESSAGES.serviceBusy);
  }
  console.error("[ai] unexpected chat failure", err);
  return jsonError(503, "providers_unavailable", FRIENDLY_MESSAGES.serviceBusy);
}
