declare const __BASE_PATH__: string | undefined;

export function basePath(): string {
  return typeof __BASE_PATH__ === "string" ? __BASE_PATH__ : "";
}

export function withBase(path: string): string {
  const base = basePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalized;
  if (normalized === "/") return `${base}/`;
  return `${base}${normalized}`;
}
