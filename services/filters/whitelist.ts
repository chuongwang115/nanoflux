export function parseKeywordList(raw: string): string[] {
  return raw
    .replaceAll("，", ",")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function parseWhitelistKeywords(whitelist: string): string[] {
  return parseKeywordList(whitelist);
}

export function applyWhitelistFilter(
  title: string,
  content: string | null,
  whitelist: string,
): { passed: boolean; keywords: string | null; reason: string | null } {
  const keywords = parseWhitelistKeywords(whitelist);

  if (keywords.length === 0) {
    return { passed: true, keywords: null, reason: null };
  }

  const haystack = `${title}\n${content ?? ""}`.toLowerCase();
  const matched = keywords.filter((keyword) =>
    haystack.includes(keyword.toLowerCase()),
  );

  if (matched.length === 0) {
    return { passed: false, keywords: null, reason: null };
  }

  return { passed: true, keywords: matched.join(","), reason: null };
}
