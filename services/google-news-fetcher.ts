import Parser from "rss-parser";
import { httpGet } from "./http-fetcher";

const RSS_USER_AGENT = "NanoFlux/1.0 (+https://github.com/nanoflux)";
const RSS_TIMEOUT_MS = 15_000;

/** Google News RSS `<source>` — not on rss-parser's default `Item` type. */
type GoogleNewsRssItemFields = {
  source?: string | { $?: string };
};

const rssParser = new Parser<Record<string, never>, GoogleNewsRssItemFields>({
  customFields: { item: ["source"] },
});

export type GoogleNewsItem = {
  title: string;
  link: string;
  description: string;
  published_at: string;
  source: string | null;
};

export type GoogleNewsSearchParams = {
  keyword: string;
  when?: string;
  language?: string;
};

export type GoogleNewsSearchResult = {
  keyword: string;
  when?: string;
  language: string;
  feedUrl: string;
  total: number;
  items: GoogleNewsItem[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function googleLocaleParams(language: string): { gl: string; ceid: string } {
  const [langRaw, regionRaw] = language.split("-");
  const lang = langRaw?.toLowerCase() ?? "en";
  const region = regionRaw?.toUpperCase();

  if (region) {
    const ceidLang = lang === "zh" ? "zh-Hans" : lang;
    return { gl: region, ceid: `${region}:${ceidLang}` };
  }

  return { gl: "US", ceid: "US:en" };
}

function buildGoogleNewsRssUrl({
  keyword,
  when,
  language,
}: GoogleNewsSearchParams): string {
  const trimmed = keyword.trim();
  if (!trimmed) {
    throw new Error("keyword must not be empty");
  }

  const query = when ? `${trimmed} when:${when}` : trimmed;
  const params = new URLSearchParams({ q: query });
  if (language) {
    params.set("hl", language);
    const { gl, ceid } = googleLocaleParams(language);
    params.set("gl", gl);
    params.set("ceid", ceid);
  }

  return `https://news.google.com/rss/search?${params.toString()}`;
}

function toGoogleNewsItem(
  entry: Parser.Item & GoogleNewsRssItemFields,
): GoogleNewsItem | null {
  const link = entry.link?.trim();
  if (!link) return null;

  const title = entry.title?.trim() || link;
  const description =
    entry.contentSnippet?.trim() ||
    entry.summary?.trim() ||
    (entry.content ? stripHtml(entry.content).slice(0, 2000) : "") ||
    "";
  const published_at = entry.isoDate || entry.pubDate || "";
  const source =
    typeof entry.source === "string"
      ? entry.source.trim() || null
      : entry.source && typeof entry.source === "object" && "$" in entry.source
        ? String(entry.source.$).trim() || null
        : null;

  return { title, link, description, published_at, source };
}

export async function searchGoogleNews(
  params: GoogleNewsSearchParams,
): Promise<GoogleNewsSearchResult> {
  const language = params.language?.trim() || "en-US";
  const feedUrl = buildGoogleNewsRssUrl({ ...params, language });

  const response = await httpGet(feedUrl, {
    headers: { "User-Agent": RSS_USER_AGENT },
    signal: AbortSignal.timeout(RSS_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const feed = await rssParser.parseString(await response.text());
  const items = (feed.items ?? [])
    .map(toGoogleNewsItem)
    .filter((item): item is GoogleNewsItem => item !== null);

  return {
    keyword: params.keyword.trim(),
    when: params.when,
    language,
    feedUrl,
    total: items.length,
    items,
  };
}
