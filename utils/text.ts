const wordSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

/** Word token count for Chinese and English (Intl.Segmenter, zero deps). */
export function countContentTokens(text: string): number {
  return [...wordSegmenter.segment(text)].filter((part) => part.isWordLike)
    .length;
}
