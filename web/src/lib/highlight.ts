import {
  parsePassedFilters,
  type PassedFilterEntry,
} from "../../../shared/passed-filters";
import { normalizeCommas } from "./utils";

export type TextSegment = { text: string; highlight: boolean };

export type ItemFilterDisplay = {
  keywords: string[];
  filtersText: string | null;
  aiReason: string | null;
  passedFilters: PassedFilterEntry[];
};

/** Keywords stored in filter entry metadata (comma-separated). */
export function parseMatchedKeywords(matchedKeywords: string | null): string[] {
  if (!matchedKeywords) return [];
  return normalizeCommas(matchedKeywords)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function mergeKeywordLists(entries: PassedFilterEntry[]): string[] {
  return [
    ...new Set(entries.flatMap((entry) => parseMatchedKeywords(entry.keywords))),
  ];
}

function mergeFilterNames(
  entries: PassedFilterEntry[],
  filterNames?: ReadonlyMap<string, string>,
): string | null {
  const names = [
    ...new Set(
      entries
        .map((entry) => filterNames?.get(entry.id) ?? entry.id)
        .filter(Boolean),
    ),
  ];
  return names.length > 0 ? names.join(", ") : null;
}

function mergeAiReasons(entries: PassedFilterEntry[]): string | null {
  const reasons = entries
    .map((entry) => entry.reason?.trim())
    .filter((reason): reason is string => Boolean(reason));
  if (reasons.length === 0) return null;
  return [...new Set(reasons)].join("\n");
}

/** Normalize filter metadata for list rendering. */
export function getItemFilterDisplay(
  item: {
    passed_filters?: string | null;
  },
  filterNames?: ReadonlyMap<string, string>,
): ItemFilterDisplay {
  const passedFilters = parsePassedFilters(item.passed_filters ?? null);
  return {
    keywords: mergeKeywordLists(passedFilters),
    filtersText: mergeFilterNames(passedFilters, filterNames),
    aiReason: mergeAiReasons(passedFilters),
    passedFilters,
  };
}

/** Split text into plain and keyword-matched spans (case-insensitive). */
export function splitByKeywords(
  text: string,
  keywords: string[],
): TextSegment[] {
  if (!text || keywords.length === 0) {
    return [{ text, highlight: false }];
  }

  const re = keywordMatchRegex(keywords, "gi");
  if (!re) {
    return [{ text, highlight: false }];
  }

  const parts: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), highlight: false });
    }
    parts.push({ text: match[0], highlight: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false });
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}

function keywordMatchRegex(keywords: string[], flags = "i"): RegExp | null {
  const escaped = [...keywords]
    .sort((a, b) => b.length - a.length)
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escaped.length === 0) return null;
  return new RegExp(`(${escaped.join("|")})`, flags);
}

/** Extract a short excerpt around the first keyword match in `text`. */
export function extractMatchedSnippet(
  text: string,
  keywords: string[],
  options?: { radiusBefore?: number; radiusAfter?: number },
): string | null {
  if (!text || keywords.length === 0) return null;

  const re = keywordMatchRegex(keywords);
  if (!re) return null;

  const match = re.exec(text);
  if (!match) return null;

  const before = options?.radiusBefore ?? 40;
  const after = options?.radiusAfter ?? 80;
  const index = match.index ?? 0;
  const matchLen = match[0].length;
  const start = Math.max(0, index - before);
  const end = Math.min(text.length, index + matchLen + after);

  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < text.length) snippet = `${snippet}…`;

  return snippet;
}

/** List preview: full content when no filter; keyword context when matched in body. */
export function getMatchedContentPreview(
  content: string | null,
  keywords: string[],
): string | null {
  if (!content) return null;
  if (keywords.length === 0) return content;
  return extractMatchedSnippet(content, keywords);
}
