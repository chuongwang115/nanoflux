import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function parseEnvLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const eq = trimmed.indexOf("=");
  if (eq <= 0) return null;

  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trimStart();
  if (!value) return { key, value: "" };

  const quote = value[0];
  if (quote === '"' || quote === "'") {
    if (value.length >= 2 && value.endsWith(quote)) {
      return { key, value: value.slice(1, -1) };
    }
    return { key, value: value.slice(1) };
  }

  const hashIdx = value.search(/\s+#/);
  if (hashIdx >= 0) value = value.slice(0, hashIdx);
  return { key, value: value.trimEnd() };
}

/** Read a value from `.env` without Bun's `$VAR` expansion. */
export function readLiteralEnvValue(
  key: string,
  envPath = ".env",
): string | undefined {
  const path =
    envPath.includes("/") || envPath.includes("\\")
      ? envPath
      : join(process.cwd(), envPath);
  if (!existsSync(path)) return undefined;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (parsed?.key === key) return parsed.value;
  }
  return undefined;
}
