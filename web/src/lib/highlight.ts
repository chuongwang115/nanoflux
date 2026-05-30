import { normalizeCommas } from "./utils";

export type TextSegment = { text: string; highlight: boolean };

/** Keywords stored in `pass_reason` (comma-separated). */
export function parseMatchedKeywords(passReason: string | null): string[] {
  if (!passReason) return [];
  return normalizeCommas(passReason)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

/** Split text into plain and keyword-matched spans (case-insensitive). */
export function splitByKeywords(
  text: string,
  keywords: string[],
): TextSegment[] {
  if (!text || keywords.length === 0) {
    return [{ text, highlight: false }];
  }

  const escaped = [...keywords]
    .sort((a, b) => b.length - a.length)
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escaped.length === 0) {
    return [{ text, highlight: false }];
  }

  const re = new RegExp(`(${escaped.join("|")})`, "gi");
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
