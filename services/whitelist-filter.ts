import { getSettings } from "../settings";

export function parseWhitelistKeywords(whitelist: string): string[] {
  return whitelist
    .replaceAll("，", ",")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function applyWhitelistFilter(
  title: string,
  content: string | null,
): { filter_passed: number; pass_reason: string | null } {

  const keywords = parseWhitelistKeywords(getSettings().whitelist);

  if (keywords.length === 0) {
    return { filter_passed: 1, pass_reason: null };
  }

  const haystack = `${title}\n${content ?? ""}`.toLowerCase();
  const matched = keywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );

  if (matched.length === 0) {
    return { filter_passed: 0, pass_reason: null };
  }

  return { filter_passed: 1, pass_reason: matched.join(",") };
}
