import { getFilterPrompt } from "../../filter";
import { applyAiFilter } from "./ai";

type ItemFilterResult = {
  filter_passed: string | null;
};

/**
 * Apply the single AI filter.
 * Empty prompt → skip filtering (pass-through, `filter_passed` stays null).
 * Non-empty prompt → LLM verdict; pass stores reason text, fail leaves null.
 */
async function applyItemFilter(
  title: string,
  content: string | null,
): Promise<ItemFilterResult> {
  const prompt = getFilterPrompt().trim();
  if (!prompt) {
    return { filter_passed: null };
  }

  const result = await applyAiFilter(title, content, prompt);
  if (!result.passed) {
    return { filter_passed: null };
  }

  return {
    filter_passed: result.reason?.trim() || "",
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
