import { readLiteralEnvValue } from "./dotenv-literal";
import { DEFAULT_HOST } from "./localhost-only";
import { passwordStrengthError } from "./password-strength";

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

export function resolveAdminPassword(): string {
  const fromFile = readLiteralEnvValue("ADMIN_PASSWORD");
  if (fromFile !== undefined) return fromFile.trim();
  return Bun.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function adminPasswordStrengthError(password: string): string | null {
  return passwordStrengthError(password, "ADMIN_PASSWORD");
}
