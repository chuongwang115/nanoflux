const wordSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

/** True when `value` is a comma-separated whitelist keyword list, not legacy AI prose. */
export function isStoredKeywordList(value: string | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length > 60) return false;
  if (/[。；！？!?]/.test(trimmed)) return false;
  if (/不相关|无关|判定|重点关注|资管频道|关联度/.test(trimmed)) return false;
  const parts = trimmed
    .replaceAll("，", ",")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return false;
  return parts.every((part) => part.length <= 16);
}

/** Word token count for Chinese and English (Intl.Segmenter, zero deps). */
export function countContentTokens(text: string): number {
  return [...wordSegmenter.segment(text)].filter((part) => part.isWordLike)
    .length;
}
