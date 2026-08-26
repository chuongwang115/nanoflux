import {
  getFilterConfig,
  getFilterPrompt,
  hasFilterPrompt,
  hasKeywordFilter,
} from "../../filter";
import { applyAiFilter } from "./ai";

type ItemFilterResult = {
  is_deleted: 0 | 1;
  deleted_reason: string | null;
};

/**
 * Apply the single AI filter.
 * Disabled or empty prompt → skip filtering (`is_deleted = 0`, `deleted_reason` null).
 * Enabled with a prompt → LLM verdict; reject soft-deletes the item and stores the reason.
 */
async function applyItemFilter(
  title: string,
  content: string | null,
): Promise<ItemFilterResult> {
  if (!hasFilterPrompt()) {
    return { is_deleted: 0, deleted_reason: null };
  }
  const prompt = getFilterPrompt().trim();

  const result = await applyAiFilter(title, content, prompt);
  if (!result.passed) {
    return {
      is_deleted: 1,
      deleted_reason: result.reason?.trim() || null,
    };
  }

  return { is_deleted: 0, deleted_reason: null };
}

function matchingKeyword(title: string): string | null {
  if (!hasKeywordFilter()) return null;
  const keywords = getFilterConfig().keywords
    .split(/[,，]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean);
  const normalizedTitle = title.toLocaleLowerCase();
  return (
    keywords.find((keyword) =>
      normalizedTitle.includes(keyword.toLocaleLowerCase()),
    ) ?? null
  );
}

export async function filterItems<
  T extends { title: string; content: string | null },
>(items: T[]): Promise<(T & ItemFilterResult)[]> {
  if (items.length === 0) return [];

  const keywordActive = hasKeywordFilter();
  const aiActive = hasFilterPrompt();
  if (!keywordActive && !aiActive) {
    console.log(
      `[filter] inactive — skip AI for ${items.length} item(s) (deleted_reason stays null)`,
    );
    return items.map((item) => ({
      ...item,
      is_deleted: 0 as const,
      deleted_reason: null,
    }));
  }

  console.log(
    `[filter] keyword=${keywordActive ? "on" : "off"} AI=${aiActive ? "on" : "off"} for ${items.length} item(s)`,
  );
  const filtered: (T & ItemFilterResult)[] = [];
  let passed = 0;
  let rejected = 0;
  let keywordRejected = 0;
  for (const item of items) {
    const keyword = matchingKeyword(item.title);
    if (keyword) {
      rejected += 1;
      keywordRejected += 1;
      filtered.push({
        ...item,
        is_deleted: 1,
        deleted_reason: `Keyword filter: ${keyword}`,
      });
      continue;
    }
    const verdict = await applyItemFilter(item.title, item.content);
    if (verdict.is_deleted === 1) rejected += 1;
    else passed += 1;
    filtered.push({ ...item, ...verdict });
  }
  console.log(
    `[filter] done passed=${passed} rejected=${rejected} keywordRejected=${keywordRejected}`,
  );
  return filtered;
}
