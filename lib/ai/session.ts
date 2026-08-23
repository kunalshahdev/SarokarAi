import type { NextRequest } from "next/server";
import { getClientIdentifier } from "@/lib/rate-limit";
import { resolveTier } from "./config";

const SESSION_COOKIE = "sarokar_sid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 180;

const SID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

export type Tier = "guest" | "user" | "premium";

export interface SessionContext {
  tier: Tier;
  limitKey: string;
  newCookie?: string;
}

function isValidSid(value: string | undefined): value is string {
  return Boolean(value && SID_PATTERN.test(value));
}

function generateSid(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function serializeCookie(sid: string, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${sid}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

function isSecureRequest(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return request.nextUrl.protocol === "https:";
}

export function resolveSession(
  request: NextRequest,
  userId?: string | null
): SessionContext {
  if (userId) {
    return { tier: resolveTier(userId), limitKey: `uid:${userId}` };
  }

  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  if (isValidSid(existing)) {
    return { tier: "guest", limitKey: `sid:${existing}` };
  }

  const sid = generateSid();
  return {
    tier: "guest",
    limitKey: `ip:${getClientIdentifier(request)}`,
    newCookie: serializeCookie(sid, isSecureRequest(request)),
  };
}
