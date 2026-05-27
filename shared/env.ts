import { DEFAULT_HOST } from "./localhost-only";

export function resolveHost(): string {
  const raw = Bun.env.HOST?.trim();
  return raw || DEFAULT_HOST;
}

export function resolvePort(): number {
  const raw = Bun.env.PORT?.trim();
  if (!raw) {
    throw new Error(
      "PORT is not set. Copy .env.example to .env and set PORT.",
    );
  }
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${raw}`);
  }
  return port;
}
