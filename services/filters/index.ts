import { getFilterPrompt, hasFilterPrompt } from "../../filter";
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

export async function filterItems<
  T extends { title: string; content: string | null },
>(items: T[]): Promise<(T & ItemFilterResult)[]> {
  if (items.length === 0) return [];

  if (!hasFilterPrompt()) {
    console.log(
      `[filter] inactive — skip AI for ${items.length} item(s) (deleted_reason stays null)`,
    );
    return items.map((item) => ({
      ...item,
      is_deleted: 0 as const,
      deleted_reason: null,
    }));
  }

  console.log(`[filter] AI scoring ${items.length} item(s)`);
  const filtered: (T & ItemFilterResult)[] = [];
  let passed = 0;
  let rejected = 0;
  for (const item of items) {
    const verdict = await applyItemFilter(item.title, item.content);
    if (verdict.is_deleted === 1) rejected += 1;
    else passed += 1;
    filtered.push({ ...item, ...verdict });
  }
  console.log(`[filter] done passed=${passed} rejected=${rejected}`);
  return filtered;
}
