import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const FILTER_PATH = resolve(process.cwd(), "filter.json");
const LEGACY_FILTER_PATH = resolve(process.cwd(), "filters.json");

/** Single AI filter config — only a prompt. Empty prompt disables filtering. */
export type FilterConfig = {
  prompt: string;
};

let filterPrompt = "";

async function writeFilterFile(): Promise<void> {
  const data = JSON.stringify({ prompt: filterPrompt }, null, 2);
  await writeFile(FILTER_PATH, data, "utf-8");
}

function extractPromptFromRaw(parsed: unknown): { prompt: string; needsPersist: boolean } {
  if (Array.isArray(parsed)) {
    for (const entry of parsed) {
      if (entry && typeof entry === "object" && "prompt" in entry) {
        const prompt = typeof entry.prompt === "string" ? entry.prompt : "";
        if (prompt.trim()) {
          return { prompt, needsPersist: true };
        }
      }
    }
    const first = parsed[0];
    const prompt =
      first && typeof first === "object" && "prompt" in first && typeof first.prompt === "string"
        ? first.prompt
        : "";
    return { prompt, needsPersist: true };
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    const prompt = typeof record.prompt === "string" ? record.prompt : "";
    const needsPersist =
      "id" in record ||
      "name" in record ||
      "whitelist" in record ||
      "blacklist" in record ||
      "filters" in record;
    return { prompt, needsPersist };
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
    const { prompt, needsPersist } = extractPromptFromRaw(JSON.parse(data));
    filterPrompt = prompt;
    if (needsPersist || fromLegacy) {
      await writeFilterFile();
    }
  } catch (error) {
    console.error("Error loading filter:", error);
    filterPrompt = "";
  }
}

/** Current filter prompt (may be empty). */
export function getFilterPrompt(): string {
  return filterPrompt;
}

/** Whether AI filtering is enabled (non-empty prompt). */
export function hasFilterPrompt(): boolean {
  return filterPrompt.trim().length > 0;
}

export async function updateFilterPrompt(prompt: string): Promise<FilterConfig> {
  filterPrompt = prompt;
  await writeFilterFile();
  return { prompt: filterPrompt };
}
