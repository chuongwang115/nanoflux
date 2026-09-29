import { getDedupState, getTokenizerState, type DedupConfig } from "../../config";
import { addItems, getDedupCandidates } from "../../db/items";
import { TimeUnit } from "../../db/utils";
import { splitTokens, tokensSimilarity } from "../../utils/similarity";
import { titleTokens } from "../../utils/text";
import { getAiConfig } from "../ai/client";
import { applyAiDedup } from "./ai";

type NewItem = Parameters<typeof addItems>[1][number];

/**
 * Stored items that the LLM confirms as the same news. Candidates share a
 * title token, are published within `windowDays`, and score > `minSimilarity`.
 */
async function findDuplicateIds(
  item: NewItem,
  stopwords: ReadonlySet<string>,
  settings: DedupConfig,
): Promise<number[]> {
  const tokens = splitTokens(titleTokens(item.title, stopwords));
  if (tokens.length === 0) return [];
  const tokenSet = new Set(tokens);

  const ranked = getDedupCandidates(item.published_at, settings.windowDays * TimeUnit.DAY)
    .map((candidate) => ({ candidate, candidateTokens: splitTokens(candidate.title_tokens) }))
    .filter(({ candidateTokens }) => candidateTokens.some((token) => tokenSet.has(token)))
    .map(({ candidate, candidateTokens }) => ({
      candidate,
      similarity: tokensSimilarity(tokens, candidateTokens),
    }))
    .filter(({ similarity }) => similarity > settings.minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, settings.maxCandidates);
  if (ranked.length === 0) return [];

  const confirmed = await applyAiDedup(item, ranked.map(({ candidate }) => candidate));
  const ids = confirmed.map((index) => ranked[index]!.candidate.id);
  console.log(
    `[dedup] "${item.title.slice(0, 40)}" candidates=${ranked.map(({ similarity }) => similarity.toFixed(2)).join(",")} duplicates=${ids.join(",") || "none"}`,
  );
  return ids;
}

/**
 * Insert items one at a time so each sees earlier items of the same batch.
 * Passed items go through duplicate detection first; duplicates get `sim_id`
 * pointing at the first-published item of their cluster.
 */
export async function addItemsWithDedup(feedId: number, newItems: NewItem[]): Promise<any[]> {
  if (newItems.length === 0) return [];

  const settings = getDedupState();
  const aiActive = settings.enabled && getAiConfig() !== null;
  if (settings.enabled && !aiActive) {
    console.warn("[dedup] LLM_BASE_URL/LLM_API_KEY/LLM_MODEL_NAME missing; skipping duplicate detection");
  }
  const stopwords = new Set(getTokenizerState().stopwords);

  const inserted: any[] = [];
  for (const item of newItems) {
    const duplicate_ids = aiActive && item.status === "passed"
      ? await findDuplicateIds(item, stopwords, settings)
      : [];
    inserted.push(...addItems(feedId, [{ ...item, duplicate_ids }]));
  }
  return inserted;
}
