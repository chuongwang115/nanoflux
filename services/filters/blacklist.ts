import { getSettings } from "../../settings";
import { parseKeywordList } from "./whitelist";

export function applyBlacklistFilter(
  title: string,
  content: string | null,
): { filter_passed: number; matched_keywords: string | null; pass_reason: string | null } {
  const keywords = parseKeywordList(getSettings().blacklist);

  if (keywords.length === 0) {
    return { filter_passed: 1, matched_keywords: null, pass_reason: null };
  }

  const haystack = `${title}\n${content ?? ""}`.toLowerCase();
  const blocked = keywords.some((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );

  if (!blocked) {
    return { filter_passed: 1, matched_keywords: null, pass_reason: null };
  }

  return {
    filter_passed: 0,
    matched_keywords: null,
    pass_reason: null,
  };
}
