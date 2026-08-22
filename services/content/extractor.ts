import { extractFromHtml } from "@extractus/article-extractor";
import { decodeHtmlBytes } from "../../utils/encoding";
import { countContentTokens } from "../../utils/text";
import { htmlToPlainText, stripSrcsetAttributes } from "../../utils/html";
import { resolveArticleUrl } from "../google-news";
import { httpGet } from "../http-fetcher";
import { pickCoverFromHtml, pickCoverFromMeta } from "../feeds/cover";

/** Unified token threshold; roughly ~200 Chinese chars / 80 English words. */
const FULL_CONTENT_MIN_TOKENS = 80;

/** Desktop Chrome on Windows — normal browser fetch, not a crawler UA. */
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const ARTICLE_TIMEOUT_MS = 15_000;
const SCRAPE_CONCURRENCY = 3;

/** Whether content is long enough that scraping is unnecessary. */
function hasFullContent(content: string | null | undefined): boolean {
  const text = content?.trim();
  if (!text) return false;
  return countContentTokens(text) >= FULL_CONTENT_MIN_TOKENS;
}

function needsFullContentScrape(content: string | null | undefined): boolean {
  return !hasFullContent(content);
}

async function fetchArticleHtml(url: string): Promise<string | null> {
  try {
    const response = await httpGet(url, {
      headers: {
        "User-Agent": BROWSER_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const bytes = Buffer.from(await response.arrayBuffer());
    return stripSrcsetAttributes(
      decodeHtmlBytes(bytes, response.headers.get("content-type")),
    );
  } catch {
    return null;
  }
}

async function enrichItemContent<
  T extends { link: string; content: string | null; cover: string | null },
>(item: T): Promise<T> {
  const resolvedLink = await resolveArticleUrl(item.link);
  let next = resolvedLink !== item.link ? { ...item, link: resolvedLink } : item;

  const needCover = !next.cover;
  const needContent = needsFullContentScrape(next.content);
  if (!needCover && !needContent) return next;

  const html = await fetchArticleHtml(next.link);
  if (!html) return next;

  if (needCover) {
    const fromMeta = pickCoverFromMeta(html, next.link);
    if (fromMeta) next = { ...next, cover: fromMeta };
  }

  const stillNeedCover = !next.cover;
  if (!needContent && !stillNeedCover) return next;

  let article: Awaited<ReturnType<typeof extractFromHtml>> = null;
  try {
    article = await extractFromHtml(html, next.link, {
      contentLengthThreshold: FULL_CONTENT_MIN_TOKENS,
    });
  } catch {
    article = null;
  }

  if (stillNeedCover) {
    const fromBody =
      pickCoverFromHtml(article?.content, next.link) ||
      pickCoverFromHtml(html, next.link);
    if (fromBody) next = { ...next, cover: fromBody };
  }

  if (needContent && article?.content) {
    const text = htmlToPlainText(article.content);
    if (text) next = { ...next, content: text };
  }

  return next;
}

export async function enrichItemsContent<
  T extends { link: string; content: string | null; cover: string | null },
>(items: T[]): Promise<T[]> {
  const enriched: T[] = [];

  for (let i = 0; i < items.length; i += SCRAPE_CONCURRENCY) {
    const batch = items.slice(i, i + SCRAPE_CONCURRENCY);
    enriched.push(...(await Promise.all(batch.map(enrichItemContent))));
  }

  return enriched;
}
