import { getFilterPrompt, hasFilterPrompt } from "../../filter";
import { applyAiFilter } from "./ai";

type ItemFilterResult = {
  filter_passed: 0 | 1;
  passed_reason: string | null;
};

/**
 * Apply the single AI filter.
 * Disabled or empty prompt → skip filtering (pass-through, `filter_passed = 1`, `passed_reason` null).
 * Enabled with a prompt → LLM verdict; pass stores reason text, fail leaves reason null.
 */
async function applyItemFilter(
  title: string,
  content: string | null,
): Promise<ItemFilterResult> {
  if (!hasFilterPrompt()) {
    return { filter_passed: 1, passed_reason: null };
  }
  const prompt = getFilterPrompt().trim();

  const result = await applyAiFilter(title, content, prompt);
  if (!result.passed) {
    return { filter_passed: 0, passed_reason: null };
  }

  return {
    filter_passed: 1,
    passed_reason: result.reason?.trim() || "",
  };
}

export async function filterItems<
  T extends { title: string; content: string | null },
>(items: T[]): Promise<(T & ItemFilterResult)[]> {
  const filtered: (T & ItemFilterResult)[] = [];
  for (const item of items) {
    filtered.push({
      ...item,
      ...(await applyItemFilter(item.title, item.content)),
    });
  }
  return filtered;
}
