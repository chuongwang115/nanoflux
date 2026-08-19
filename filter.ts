import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const FILTER_PATH = resolve(process.cwd(), "filter.json");
const LEGACY_FILTER_PATH = resolve(process.cwd(), "filters.json");

/** Single AI filter config. Filtering runs only when enabled and prompt is non-empty. */
export type FilterConfig = {
  prompt: string;
  enabled: boolean;
};

let filterPrompt = "";
let filterEnabled = false;

async function writeFilterFile(): Promise<void> {
  const data = JSON.stringify(
    { prompt: filterPrompt, enabled: filterEnabled },
    null,
    2,
  );
  await writeFile(FILTER_PATH, data, "utf-8");
}

function extractConfigFromRaw(parsed: unknown): {
  prompt: string;
  enabled: boolean;
  needsPersist: boolean;
} {
  if (Array.isArray(parsed)) {
    for (const entry of parsed) {
      if (entry && typeof entry === "object" && "prompt" in entry) {
        const prompt = typeof entry.prompt === "string" ? entry.prompt : "";
        if (prompt.trim()) {
          return { prompt, enabled: true, needsPersist: true };
        }
      }
    }
    const first = parsed[0];
    const prompt =
      first && typeof first === "object" && "prompt" in first && typeof first.prompt === "string"
        ? first.prompt
        : "";
    return { prompt, enabled: prompt.trim().length > 0, needsPersist: true };
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    const prompt = typeof record.prompt === "string" ? record.prompt : "";
    const hasEnabled = "enabled" in record;
    const enabled = hasEnabled
      ? Boolean(record.enabled)
      : prompt.trim().length > 0;
    const needsPersist =
      !hasEnabled ||
      "id" in record ||
      "name" in record ||
      "whitelist" in record ||
      "blacklist" in record ||
      "filters" in record;
    return { prompt, enabled, needsPersist };
  }

  throw new Error("filter.json must be an object or array");
}

export async function loadFilters(): Promise<void> {
  try {
    let data: string;
    let fromLegacy = false;
    try {
      data = await readFile(FILTER_PATH, "utf-8");
    } catch {
      data = await readFile(LEGACY_FILTER_PATH, "utf-8");
      fromLegacy = true;
    }
    const { prompt, enabled, needsPersist } = extractConfigFromRaw(JSON.parse(data));
    filterPrompt = prompt;
    filterEnabled = enabled;
    if (needsPersist || fromLegacy) {
      await writeFilterFile();
    }
  } catch (error) {
    console.error("Error loading filter:", error);
    filterPrompt = "";
    filterEnabled = false;
  }
}

/** Current filter prompt (may be empty). */
export function getFilterPrompt(): string {
  return filterPrompt;
}

export function getFilterConfig(): FilterConfig {
  return { prompt: filterPrompt, enabled: filterEnabled };
}

/** Whether AI filtering is active (enabled and non-empty prompt). */
export function hasFilterPrompt(): boolean {
  return filterEnabled && filterPrompt.trim().length > 0;
}

export async function updateFilterConfig(partial: {
  prompt?: string;
  enabled?: boolean;
}): Promise<FilterConfig> {
  if (typeof partial.prompt === "string") {
    filterPrompt = partial.prompt;
  }
  if (typeof partial.enabled === "boolean") {
    filterEnabled = partial.enabled;
  }
  await writeFilterFile();
  return getFilterConfig();
}

export async function updateFilterPrompt(prompt: string): Promise<FilterConfig> {
  return updateFilterConfig({ prompt });
}
