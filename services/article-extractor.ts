import { extractFromHtml } from "@extractus/article-extractor";
import { httpGet } from "./http-fetcher";

/** Unified token threshold; roughly ~200 Chinese chars / 80 English words. */
export const FULL_CONTENT_MIN_TOKENS = 80;

/** Mimics Google crawler; many paywalled sites serve full HTML to this UA. */
const GOOGLEBOT_USER_AGENT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const ARTICLE_REFERER = "https://www.google.com/";

const ARTICLE_TIMEOUT_MS = 15_000;
const SCRAPE_CONCURRENCY = 3;

const wordSegmenter = new Intl.Segmenter("zh", { granularity: "word" });

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Unified word token count for Chinese and English (Intl.Segmenter, zero deps). */
export function countContentTokens(text: string): number {
  return [...wordSegmenter.segment(text)].filter((part) => part.isWordLike)
    .length;
}

/** Whether content is long enough that scraping is unnecessary. */
export function hasFullContent(content: string | null | undefined): boolean {
  const text = content?.trim();
  if (!text) return false;
  return countContentTokens(text) >= FULL_CONTENT_MIN_TOKENS;
}

export function needsFullContentScrape(content: string | null | undefined): boolean {
  return !hasFullContent(content);
}

export async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    const response = await httpGet(url, {
      headers: {
        "User-Agent": GOOGLEBOT_USER_AGENT,
        Referer: ARTICLE_REFERER,
      },
      signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const html = await response.text();
    const article = await extractFromHtml(html, url, {
      contentLengthThreshold: FULL_CONTENT_MIN_TOKENS,
    });
    if (!article?.content) return null;

    const text = stripHtml(article.content);
    return text || null;
  } catch {
    return null;
  }
}

export async function enrichItemContent<
  T extends { link: string; content: string | null },
>(item: T): Promise<T> {
  if (!needsFullContentScrape(item.content)) return item;

  const scraped = await fetchArticleContent(item.link);
  if (!scraped) return item;

  return { ...item, content: scraped };
}

export async function enrichItemsContent<
  T extends { link: string; content: string | null },
>(items: T[]): Promise<T[]> {
  const enriched: T[] = [];

  for (let i = 0; i < items.length; i += SCRAPE_CONCURRENCY) {
    const batch = items.slice(i, i + SCRAPE_CONCURRENCY);
    enriched.push(...(await Promise.all(batch.map(enrichItemContent))));
  }

  return enriched;
}
