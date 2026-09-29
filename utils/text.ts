const wordSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

/** Word-like tokens for Chinese and English (Intl.Segmenter, zero deps). */
export function tokenizeText(text: string): string[] {
  return [...wordSegmenter.segment(text)]
    .filter((part) => part.isWordLike)
    .map((part) => part.segment);
}

/** Word token count for Chinese and English (Intl.Segmenter, zero deps). */
export function countContentTokens(text: string): number {
  return tokenizeText(text).length;
}

/**
 * Space-separated title tokens as stored in `t_items.title_tokens`.
 * `stopwords` must be lowercase; tokens are matched case-insensitively.
 */
export function titleTokens(title: string, stopwords: ReadonlySet<string>): string {
  return tokenizeText(title)
    .filter((token) => !stopwords.has(token.toLocaleLowerCase()))
    .join(" ");
}
