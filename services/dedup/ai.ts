import { chatCompletion, getAiConfig } from "../ai/client";

const MAX_CONTENT_CHARS = 300;

export type DedupNews = {
  title: string;
  content: string | null;
  published_at: string;
};

function describe(news: DedupNews): string {
  const snippet = (news.content ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_CONTENT_CHARS);
  return [
    `Title: ${news.title}`,
    `Published: ${news.published_at}`,
    `Summary: ${snippet || "(empty)"}`,
  ].join("\n");
}

function parseDuplicates(text: string, count: number): number[] | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as { duplicates?: unknown };
    if (!Array.isArray(parsed.duplicates)) return null;
    return [
      ...new Set(
        parsed.duplicates
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value >= 1 && value <= count),
      ),
    ];
  } catch {
    return null;
  }
}

/**
 * Ask the LLM which candidates report the same news as `news`.
 * Returns 0-based candidate indexes. Fail-open: errors mean no duplicates.
 */
export async function applyAiDedup(
  news: DedupNews,
  candidates: DedupNews[],
): Promise<number[]> {
  if (candidates.length === 0 || !getAiConfig()) return [];

  const userMessage = [
    "New news:",
    describe(news),
    "",
    "Candidates:",
    ...candidates.map((candidate, index) => `[${index + 1}]\n${describe(candidate)}`),
  ].join("\n");

  try {
    const text = await chatCompletion(
      "You are a news deduplicator. A candidate is a duplicate when it reports the same event or story as the new news, " +
        "even if worded differently, translated, or from another outlet. Related but different events are not duplicates. " +
        'Reply with JSON only: {"duplicates": number[]} listing the candidate numbers that are duplicates (empty when none).',
      userMessage,
    );
    const duplicates = parseDuplicates(text, candidates.length);
    if (!duplicates) {
      throw new Error(`Unparseable AI response: ${text.slice(0, 100)}`);
    }
    return duplicates.map((value) => value - 1);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ai-dedup] ${message}`);
    return [];
  }
}
