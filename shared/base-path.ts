/** Subpath when served behind a reverse proxy (e.g. `/news`). No trailing slash. */
export function resolveBasePath(
  env: Record<string, string | undefined> = process.env,
): string {
  const raw = env.BASE_PATH?.trim();
  if (!raw) return "";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.replace(/\/+$/, "") || "";
}

export function withBase(path: string, base = resolveBasePath()): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalized;
  if (normalized === "/") return `${base}/`;
  return `${base}${normalized}`;
}
