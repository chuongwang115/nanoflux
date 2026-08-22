import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { md5Hex } from "./utils/hash";

const FEVER_PATH = resolve(process.cwd(), "fever.json");

export type FeverConfig = {
  enabled: boolean;
  user: string;
  password: string;
};

export type FeverPublicConfig = {
  enabled: boolean;
  user: string;
  hasPassword: boolean;
};

let feverEnabled = false;
let feverUser = "";
let feverPassword = "";

function snapshot(): FeverConfig {
  return {
    enabled: feverEnabled,
    user: feverUser,
    password: feverPassword,
  };
}

export function getFeverPublicConfig(): FeverPublicConfig {
  return {
    enabled: feverEnabled,
    user: feverUser,
    hasPassword: feverPassword.length > 0,
  };
}

export function isFeverEnabled(): boolean {
  return feverEnabled;
}

export function getFeverApiKey(): string | null {
  if (!feverEnabled || !feverUser.trim() || !feverPassword) {
    return null;
  }
  return md5Hex(`${feverUser.trim()}:${feverPassword}`);
}

async function writeFeverFile(): Promise<void> {
  const data = JSON.stringify(snapshot(), null, 2);
  await writeFile(FEVER_PATH, data, "utf-8");
}

function extractConfigFromRaw(parsed: unknown): FeverConfig {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("fever.json must be an object");
  }
  const record = parsed as Record<string, unknown>;
  return {
    enabled: Boolean(record.enabled),
    user: typeof record.user === "string" ? record.user : "",
    password: typeof record.password === "string" ? record.password : "",
  };
}

export async function loadFeverConfig(): Promise<void> {
  try {
    const data = await readFile(FEVER_PATH, "utf-8");
    const config = extractConfigFromRaw(JSON.parse(data));
    feverEnabled = config.enabled;
    feverUser = config.user;
    feverPassword = config.password;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      feverEnabled = false;
      feverUser = "";
      feverPassword = "";
      return;
    }
    console.error("Error loading fever config:", error);
    feverEnabled = false;
    feverUser = "";
    feverPassword = "";
  }
}

export async function updateFeverConfig(partial: {
  enabled?: boolean;
  user?: string;
  password?: string;
}): Promise<FeverPublicConfig> {
  const nextUser = typeof partial.user === "string" ? partial.user.trim() : feverUser;
  const nextPassword =
    typeof partial.password === "string" && partial.password.length > 0
      ? partial.password
      : feverPassword;
  const nextEnabled =
    typeof partial.enabled === "boolean" ? partial.enabled : feverEnabled;

  if (nextEnabled && (!nextUser || !nextPassword)) {
    throw new Error("Fever API requires a user and password when enabled");
  }

  feverUser = nextUser;
  feverPassword = nextPassword;
  feverEnabled = nextEnabled;
  await writeFeverFile();
  return getFeverPublicConfig();
}
