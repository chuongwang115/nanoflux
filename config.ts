import { readFile, writeFile } from "fs/promises";
import { randomBytes } from "node:crypto";
import { resolve } from "path";
import { passwordStrengthError } from "./shared/password-strength";
import { DEFAULT_TRANSLATE_PROMPT } from "./shared/translate";

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

export type DedupConfig = {
  enabled: boolean;
  /** Only items published within this many days of each other are compared. */
  windowDays: number;
  /** Title-token similarity a candidate must exceed before the LLM sees it. */
  minSimilarity: number;
  /** Most similar candidates sent to the LLM per item. */
  maxCandidates: number;
};

export const DEDUP_LIMITS = {
  windowDays: { min: 1, max: 30 },
  minSimilarity: { min: 0, max: 1 },
  maxCandidates: { min: 1, max: 20 },
} as const;

export type FeverConfig = {
  enabled: boolean;
  user: string;
  password: string;
};

export type McpConfig = {
  /** Allow clients other than localhost to reach the MCP endpoint. */
  remoteAccess: boolean;
  /** Bearer token required only while remote access is enabled. */
  authorization: string;
};

export type TokenizerConfig = {
  /** Tokens dropped from `title_tokens`, matched case-insensitively. */
  stopwords: string[];
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
  dedup: DedupConfig;
  fever: FeverConfig;
  mcp: McpConfig;
  tokenizer: TokenizerConfig;
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
const DEFAULT_DEDUP: DedupConfig = {
  enabled: true,
  windowDays: 3,
  minSimilarity: 0.6,
  maxCandidates: 5,
};
const DEFAULT_FEVER: FeverConfig = {
  enabled: false,
  user: "",
  password: "",
};
const DEFAULT_MCP: McpConfig = {
  remoteAccess: false,
  authorization: "",
};
const DEFAULT_TOKENIZER: TokenizerConfig = {
  stopwords: [
    "的", "了", "是", "在", "和", "与", "及", "或", "等", "也", "都", "就",
    "被", "把", "将", "对", "从", "为", "于", "以", "之", "其", "这", "那",
    "a", "an", "the", "of", "to", "in", "on", "for", "and", "or", "is",
    "are", "was", "were", "be", "at", "by", "with", "as", "from", "it",
  ],
};

let loaded = false;
let config: AppConfig = {
  filter: { ...DEFAULT_FILTER },
  translate: { ...DEFAULT_TRANSLATE },
  dedup: { ...DEFAULT_DEDUP },
  fever: { ...DEFAULT_FEVER },
  mcp: { ...DEFAULT_MCP },
  tokenizer: { ...DEFAULT_TOKENIZER },
};
let writeLock: Promise<void> = Promise.resolve();

function cloneConfig(value: AppConfig): AppConfig {
  return {
    filter: { ...value.filter },
    translate: { ...value.translate },
    dedup: { ...value.dedup },
    fever: { ...value.fever },
    mcp: { ...value.mcp },
    tokenizer: { stopwords: [...value.tokenizer.stopwords] },
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

function clampNumber(
  value: unknown,
  limits: { min: number; max: number },
  fallback: number,
  integer = false,
): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  const bounded = Math.min(limits.max, Math.max(limits.min, num));
  return integer ? Math.round(bounded) : bounded;
}

export function parseDedupConfig(parsed: unknown): DedupConfig {
  const record = asRecord(parsed);
  if (!record) throw new Error("dedup config must be an object");
  return {
    enabled:
      typeof record.enabled === "boolean" ? record.enabled : DEFAULT_DEDUP.enabled,
    windowDays: clampNumber(
      record.windowDays,
      DEDUP_LIMITS.windowDays,
      DEFAULT_DEDUP.windowDays,
      true,
    ),
    minSimilarity: clampNumber(
      record.minSimilarity,
      DEDUP_LIMITS.minSimilarity,
      DEFAULT_DEDUP.minSimilarity,
    ),
    maxCandidates: clampNumber(
      record.maxCandidates,
      DEDUP_LIMITS.maxCandidates,
      DEFAULT_DEDUP.maxCandidates,
      true,
    ),
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

export function parseMcpConfig(parsed: unknown): McpConfig {
  const record = asRecord(parsed);
  if (!record) throw new Error("mcp config must be an object");
  return {
    remoteAccess: Boolean(record.remoteAccess),
    authorization:
      typeof record.authorization === "string" ? record.authorization : "",
  };
}

function normalizeStopwords(values: unknown[]): string[] {
  return [
    ...new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim().toLocaleLowerCase())
        .filter(Boolean),
    ),
  ];
}

export function parseTokenizerConfig(parsed: unknown): TokenizerConfig {
  const record = asRecord(parsed);
  if (!record) throw new Error("tokenizer config must be an object");
  return {
    stopwords: Array.isArray(record.stopwords)
      ? normalizeStopwords(record.stopwords)
      : [...DEFAULT_TOKENIZER.stopwords],
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
    dedup: { ...DEFAULT_DEDUP },
    fever: { ...DEFAULT_FEVER },
    mcp: { ...DEFAULT_MCP },
    tokenizer: { ...DEFAULT_TOKENIZER },
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
      if (record.dedup !== undefined) {
        config.dedup = parseDedupConfig(record.dedup);
      } else {
        needsPersist = true;
      }
      if (record.fever !== undefined) {
        config.fever = parseFeverConfig(record.fever);
      }
      if (record.mcp !== undefined) {
        config.mcp = parseMcpConfig(record.mcp);
      }
      if (record.tokenizer !== undefined) {
        config.tokenizer = parseTokenizerConfig(record.tokenizer);
      } else {
        needsPersist = true;
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
      dedup: { ...DEFAULT_DEDUP },
      fever: { ...DEFAULT_FEVER },
      mcp: { ...DEFAULT_MCP },
      tokenizer: { ...DEFAULT_TOKENIZER },
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

export function getDedupState(): DedupConfig {
  return { ...config.dedup };
}

export function getFeverState(): FeverConfig {
  return { ...config.fever };
}

export function getMcpState(): McpConfig {
  return { ...config.mcp };
}

export function getTokenizerState(): TokenizerConfig {
  return { stopwords: [...config.tokenizer.stopwords] };
}

/** Create a high-entropy bearer token without changing the saved config. */
export function generateMcpAuthorization(): string {
  return `mcp_${randomBytes(32).toString("base64url")}`;
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
  if (config.translate.enabled && !config.translate.prompt.trim()) {
    config.translate.prompt = DEFAULT_TRANSLATE_PROMPT;
  }
  const nextLang = parseTranslateTargetLang(partial.targetLang);
  if (nextLang) {
    config.translate.targetLang = nextLang;
  }
  await persist();
  return getTranslateState();
}

export async function updateDedupState(
  partial: Partial<DedupConfig>,
): Promise<DedupConfig> {
  config.dedup = parseDedupConfig({ ...config.dedup, ...partial });
  await persist();
  return getDedupState();
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

export async function updateMcpState(partial: {
  remoteAccess?: boolean;
  authorization?: string;
}): Promise<McpConfig> {
  const nextRemoteAccess =
    typeof partial.remoteAccess === "boolean"
      ? partial.remoteAccess
      : config.mcp.remoteAccess;

  const nextAuthorization =
    typeof partial.authorization === "string"
      ? partial.authorization.trim()
      : config.mcp.authorization;

  if (nextRemoteAccess && !nextAuthorization) {
    throw new Error("Generate an MCP authorization token before enabling remote access");
  }

  config.mcp.remoteAccess = nextRemoteAccess;
  config.mcp.authorization = nextAuthorization;
  await persist();
  return getMcpState();
}
