import { parseKeywordList } from "./whitelist";

export function applyBlacklistFilter(
  title: string,
  content: string | null,
  blacklist: string,
): { passed: boolean; keywords: string | null; reason: string | null } {
  const keywords = parseKeywordList(blacklist);

  if (keywords.length === 0) {
    return { passed: true, keywords: null, reason: null };
  }

  const haystack = `${title}\n${content ?? ""}`.toLowerCase();
  const blocked = keywords.some((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );

  if (!blocked) {
    return { passed: true, keywords: null, reason: null };
  }

  return {
    passed: false,
    keywords: null,
    reason: null,
  };
}
