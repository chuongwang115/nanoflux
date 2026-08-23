import { Elysia, type AnyElysia } from "elysia";

export const DEFAULT_HOST = "127.0.0.1";

/** `HOST=127.0.0.1` enables REST/Fever localhost-only middleware. MCP is always localhost-only. */
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

/** Apply localhost restriction to `routes` (Elysia named plugins do not inherit parent hooks). */
export function withLocalhostOnly(routes: AnyElysia) {
  return new Elysia().onBeforeHandle(({ request, server, set }) => {
    const address = server?.requestIP(request)?.address;
    if (!isLocalhostAddress(address)) {
      set.status = 403;
      return { error: "Forbidden" };
    }
  }).use(routes);
}
