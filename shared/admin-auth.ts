import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "nanoflux_session";
export const ADMIN_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 20;

type LoginBucket = { count: number; resetAt: number };
const loginAttempts = new Map<string, LoginBucket>();

function hmacHex(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function equalHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function passwordsEqual(given: string, expected: string): boolean {
  const left = Buffer.from(given, "utf8");
  const right = Buffer.from(expected, "utf8");
  if (left.length !== right.length) {
    if (right.length > 0) timingSafeEqual(right, right);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createSessionToken(secret: string, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const payload = String(exp);
  return `${payload}.${hmacHex(secret, `nanoflux-session:${payload}`)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isInteger(exp) || exp * 1000 <= now) return false;
  const expected = hmacHex(secret, `nanoflux-session:${payload}`);
  return equalHex(sig, expected);
}

export function readCookie(
  header: string | null,
  name: string,
): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === name) return rest.join("=");
  }
  return undefined;
}

export function readBearer(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || undefined;
}

export function isRequestAuthenticated(
  request: Request,
  secret: string,
): boolean {
  const bearer = readBearer(request.headers.get("authorization"));
  if (bearer && passwordsEqual(bearer, secret)) return true;
  const token = readCookie(
    request.headers.get("cookie"),
    ADMIN_SESSION_COOKIE,
  );
  return verifySessionToken(token, secret);
}

export function sessionCookieHeader(
  token: string | null,
  secure: boolean,
): string {
  if (!token) {
    return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  }
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ADMIN_SESSION_TTL_SECONDS}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function isSecureRequest(request: Request): boolean {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  const forwarded = request.headers.get("x-forwarded-proto");
  return forwarded?.split(",")[0]?.trim() === "https";
}

export function consumeLoginAttempt(ip: string): boolean {
  const now = Date.now();
  const existing = loginAttempts.get(ip);
  if (!existing || existing.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }
  if (existing.count >= LOGIN_MAX_ATTEMPTS) return false;
  existing.count += 1;
  return true;
}
