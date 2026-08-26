import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { passwordStrengthError } from "./shared/password-strength";

export const TRANSLATE_TARGET_LANGS = ["en", "zh-Hans", "zh-Hant"] as const;
export type TranslateTargetLang = (typeof TRANSLATE_TARGET_LANGS)[number];
export const DEFAULT_TRANSLATE_TARGET_LANG: TranslateTargetLang = "zh-Hans";

export type FilterConfig = {
  prompt: string;
  enabled: boolean;
  keywords: string;
  sources: string[];
};

export type TranslateConfig = {
  prompt: string;
  enabled: boolean;
  targetLang: TranslateTargetLang;
};

export type FeverConfig = {
  enabled: boolean;
  user: string;
  password: string;
};

export function parseTranslateTargetLang(
  value: unknown,
): TranslateTargetLang | null {
  if (value === "zh") return "zh-Hans";
  if (value === "en" || value === "zh-Hans" || value === "zh-Hant") {
    return value;
  }
  return null;
}

const CONFIG_PATH = resolve(process.cwd(), "config.json");
const LEGACY_FILTER_PATH = resolve(process.cwd(), "filter.json");
const LEGACY_FILTERS_PATH = resolve(process.cwd(), "filters.json");
const LEGACY_TRANSLATE_PATH = resolve(process.cwd(), "translate.json");
const LEGACY_FEVER_PATH = resolve(process.cwd(), "fever.json");

export type AppConfig = {
  filter: FilterConfig;
  translate: TranslateConfig;
  fever: FeverConfig;
};

const DEFAULT_FILTER: FilterConfig = {
  prompt: "",
  enabled: false,
  keywords: "",
  sources: [],
};
const DEFAULT_TRANSLATE: TranslateConfig = {
  prompt: "",
  enabled: false,
  targetLang: DEFAULT_TRANSLATE_TARGET_LANG,
};
const DEFAULT_FEVER: FeverConfig = {
  enabled: false,
  user: "",
  password: "",
};

let loaded = false;
let config: AppConfig = {
  filter: { ...DEFAULT_FILTER },
  translate: { ...DEFAULT_TRANSLATE },
  fever: { ...DEFAULT_FEVER },
};
let writeLock: Promise<void> = Promise.resolve();

function cloneConfig(value: AppConfig): AppConfig {
  return {
    filter: { ...value.filter },
    translate: { ...value.translate },
    fever: { ...value.fever },
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function normalizeFilterSource(source: string): string {
  const trimmed = source.trim().toLocaleLowerCase();
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`)
      .hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^www\./, "");
  }
}

export function parseFilterConfig(parsed: unknown): {
  config: FilterConfig;
  needsPersist: boolean;
} {
  if (Array.isArray(parsed)) {
    for (const entry of parsed) {
      if (entry && typeof entry === "object" && "prompt" in entry) {
        const prompt = typeof entry.prompt === "string" ? entry.prompt : "";
        if (prompt.trim()) {
          return {
            config: { prompt, enabled: true, keywords: "", sources: [] },
            needsPersist: true,
          };
        }
      }
    }
    const first = parsed[0];
    const prompt =
      first &&
      typeof first === "object" &&
      "prompt" in first &&
      typeof first.prompt === "string"
        ? first.prompt
        : "";
    return {
      config: {
        prompt,
        enabled: prompt.trim().length > 0,
        keywords: "",
        sources: [],
      },
      needsPersist: true,
    };
  }

  const record = asRecord(parsed);
  if (!record) {
    throw new Error("filter config must be an object or array");
  }

  const prompt = typeof record.prompt === "string" ? record.prompt : "";
  const hasEnabled = "enabled" in record;
  const enabled = hasEnabled ? Boolean(record.enabled) : prompt.trim().length > 0;
  const keywords = typeof record.keywords === "string" ? record.keywords : "";
  const sources = Array.isArray(record.sources)
    ? [...new Set(record.sources.filter((source): source is string => typeof source === "string").map(normalizeFilterSource).filter(Boolean))]
    : [];
  const needsPersist =
    !hasEnabled ||
    !("keywords" in record) ||
    !Array.isArray(record.sources) ||
    "keywordEnabled" in record ||
    "id" in record ||
    "name" in record ||
    "whitelist" in record ||
    "blacklist" in record ||
    "filters" in record;
  return { config: { prompt, enabled, keywords, sources }, needsPersist };
}

export function parseTranslateConfig(parsed: unknown): TranslateConfig {
  const record = asRecord(parsed);
  if (!record) {
    throw new Error("translate config must be an object");
  }
  return {
    prompt: typeof record.prompt === "string" ? record.prompt : "",
    enabled: Boolean(record.enabled),
    targetLang:
      parseTranslateTargetLang(record.targetLang) ?? DEFAULT_TRANSLATE_TARGET_LANG,
  };
}

export function parseFeverConfig(parsed: unknown): FeverConfig {
  const record = asRecord(parsed);
  if (!record) {
    throw new Error("fever config must be an object");
  }
  return {
    enabled: Boolean(record.enabled),
    user: typeof record.user === "string" ? record.user : "",
    password: typeof record.password === "string" ? record.password : "",
  };
}

async function readJsonFile(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, "utf-8"));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function persistUnlocked(): Promise<void> {
  const data = JSON.stringify(config, null, 2);
  await writeFile(CONFIG_PATH, data, "utf-8");
}

async function persist(): Promise<void> {
  const pending = writeLock.then(persistUnlocked, persistUnlocked);
  writeLock = pending.then(
    () => undefined,
    () => undefined,
  );
  await pending;
}

async function loadLegacySections(): Promise<{
  config: AppConfig;
  needsPersist: boolean;
}> {
  let needsPersist = false;
  const next = cloneConfig({
    filter: { ...DEFAULT_FILTER },
    translate: { ...DEFAULT_TRANSLATE },
    fever: { ...DEFAULT_FEVER },
  });

  const filterRaw =
    (await readJsonFile(LEGACY_FILTER_PATH)) ??
    (await readJsonFile(LEGACY_FILTERS_PATH));
  if (filterRaw !== null) {
    const parsed = parseFilterConfig(filterRaw);
    next.filter = parsed.config;
    needsPersist = true;
  }

  const translateRaw = await readJsonFile(LEGACY_TRANSLATE_PATH);
  if (translateRaw !== null) {
    next.translate = parseTranslateConfig(translateRaw);
    needsPersist = true;
  }

  const feverRaw = await readJsonFile(LEGACY_FEVER_PATH);
  if (feverRaw !== null) {
    next.fever = parseFeverConfig(feverRaw);
    needsPersist = true;
  }

  return { config: next, needsPersist };
}

export async function loadAppConfig(): Promise<void> {
  if (loaded) return;

  try {
    const raw = await readJsonFile(CONFIG_PATH);
    if (raw !== null) {
      const record = asRecord(raw);
      if (!record) {
        throw new Error("config.json must be an object");
      }
      let needsPersist = false;
      if (record.filter !== undefined) {
        const parsed = parseFilterConfig(record.filter);
        config.filter = parsed.config;
        needsPersist = needsPersist || parsed.needsPersist;
      }
      if (record.translate !== undefined) {
        config.translate = parseTranslateConfig(record.translate);
      }
      if (record.fever !== undefined) {
        config.fever = parseFeverConfig(record.fever);
      }
      loaded = true;
      if (needsPersist) {
        await persist();
      }
      return;
    }

    const migrated = await loadLegacySections();
    config = migrated.config;
    loaded = true;
    if (migrated.needsPersist) {
      await persist();
    }
  } catch (error) {
    console.error("Error loading config.json:", error);
    config = {
      filter: { ...DEFAULT_FILTER },
      translate: { ...DEFAULT_TRANSLATE },
      fever: { ...DEFAULT_FEVER },
    };
    loaded = true;
  }
}

export function getFilterState(): FilterConfig {
  return { ...config.filter };
}

export function getTranslateState(): TranslateConfig {
  return { ...config.translate };
}

export function getFeverState(): FeverConfig {
  return { ...config.fever };
}

export async function updateFilterState(partial: {
  prompt?: string;
  enabled?: boolean;
  keywords?: string;
  sources?: string[];
}): Promise<FilterConfig> {
  if (typeof partial.prompt === "string") {
    config.filter.prompt = partial.prompt;
  }
  if (typeof partial.enabled === "boolean") {
    config.filter.enabled = partial.enabled;
  }
  if (typeof partial.keywords === "string") {
    config.filter.keywords = partial.keywords;
  }
  if (Array.isArray(partial.sources)) {
    config.filter.sources = [
      ...new Set(
        partial.sources
          .filter((source): source is string => typeof source === "string")
          .map(normalizeFilterSource)
          .filter(Boolean),
      ),
    ];
  }
  await persist();
  return getFilterState();
}

export async function updateTranslateState(partial: {
  prompt?: string;
  enabled?: boolean;
  targetLang?: TranslateConfig["targetLang"];
}): Promise<TranslateConfig> {
  if (typeof partial.prompt === "string") {
    config.translate.prompt = partial.prompt;
  }
  if (typeof partial.enabled === "boolean") {
    config.translate.enabled = partial.enabled;
  }
  const nextLang = parseTranslateTargetLang(partial.targetLang);
  if (nextLang) {
    config.translate.targetLang = nextLang;
  }
  await persist();
  return getTranslateState();
}

export async function updateFeverState(partial: {
  enabled?: boolean;
  user?: string;
  password?: string;
}): Promise<FeverConfig> {
  const nextUser =
    typeof partial.user === "string" ? partial.user.trim() : config.fever.user;
  const nextPassword =
    typeof partial.password === "string" && partial.password.length > 0
      ? partial.password
      : config.fever.password;
  const nextEnabled =
    typeof partial.enabled === "boolean" ? partial.enabled : config.fever.enabled;

  if (nextEnabled && (!nextUser || !nextPassword)) {
    throw new Error("Fever API requires a user and password when enabled");
  }

  const settingPassword =
    typeof partial.password === "string" && partial.password.length > 0;
  if (settingPassword || (nextEnabled && nextPassword)) {
    const strengthError = passwordStrengthError(nextPassword, "Fever password");
    if (strengthError) {
      throw new Error(strengthError);
    }
  }

  config.fever.user = nextUser;
  config.fever.password = nextPassword;
  config.fever.enabled = nextEnabled;
  await persist();
  return getFeverState();
}
