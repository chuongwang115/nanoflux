import { Elysia } from "elysia";

export const DEFAULT_HOST = "127.0.0.1";

export function resolveHost(): string {
  const raw = Bun.env.HOST?.trim();
  return raw || DEFAULT_HOST;
}

/** `HOST=127.0.0.1` enables API/SSE/MCP localhost-only middleware. */
export function isLocalhostRestricted(host: string): boolean {
  return host === DEFAULT_HOST;
}

const LOCALHOST_ADDRESSES = new Set([
  "127.0.0.1",
  "::1",
  "::ffff:127.0.0.1",
]);

export function isLocalhostAddress(address: string | undefined): boolean {
  if (!address) return false;
  if (LOCALHOST_ADDRESSES.has(address)) return true;
  if (address.startsWith("::ffff:")) {
    return address === "::ffff:127.0.0.1";
  }
  return false;
}

export const localhostOnly = new Elysia({ name: "localhost-only" }).onBeforeHandle(
  ({ request, server, set }) => {
    const address = server?.requestIP(request)?.address;
    if (!isLocalhostAddress(address)) {
      set.status = 403;
      return { error: "Forbidden" };
    }
  },
);
