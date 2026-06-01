import { applyAiFilter } from "./ai";
import { applyBlacklistFilter } from "./blacklist";
import { applyWhitelistFilter } from "./whitelist";

export type ItemFilterResult = {
  filter_passed: number;
  matched_keywords: string | null;
  pass_reason: string | null;
};

export async function applyItemFilter(
  title: string,
  content: string | null,
): Promise<ItemFilterResult> {
  const blacklist = applyBlacklistFilter(title, content);
  if (blacklist.filter_passed !== 1) {
    return blacklist;
  }
  const whitelist = applyWhitelistFilter(title, content);
  if (whitelist.filter_passed !== 1) {
    return whitelist;
  }
  return applyAiFilter(title, content, whitelist.matched_keywords);
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
