import Parser from "rss-parser";
import { addItems } from "../../db/items";
import { getDueFeeds, updateFeedFetchState } from "../../db/feeds";
import type { Feed } from "../../db/schema";
import { parseFeedGuids, serializeFeedGuids } from "../../db/utils";
import { emitNewItems } from "../../sse/streamer";
import { maxPublishedAt, parsePublishedAt } from "../../utils/date";
import { isMd5Format, md5Hex } from "../../utils/hash";
import { stripHtml } from "../../utils/html";
import { enrichItemsContent } from "../content/extractor";
import { filterItems } from "../filters";
import { fetchRssFeed } from "../rss";
import {
  DEFAULT_FETCH_INTERVAL_MIN,
  nextFetchedAtIso,
  nextFetchIntervalMin,
} from "./interval";

const rssParser = new Parser();

function toStoredItem(entry: Parser.Item) {
  const link = entry.link?.trim();
  if (!link) return null;

  const rawGuid = entry.guid?.trim() || link;
  const guid = isMd5Format(rawGuid) ? rawGuid : md5Hex(link);
  const title = entry.title?.trim() || link;

  const description =
    entry.contentSnippet?.trim() ||
    entry.summary?.trim() ||
    (entry.content ? stripHtml(entry.content) : "") ||
    null;

  const published_at =
    parsePublishedAt(entry.isoDate) ||
    parsePublishedAt(entry.pubDate) ||
    new Date().toISOString();

  return {
    guid,
    title,
    link,
    content: description && description != title ? description : null,
    published_at,
  };
}

function feedBuildDate(parsed: Record<string, unknown>): string | null {
  const pubDate =
    typeof parsed.pubDate === "string" ? parsed.pubDate : undefined;
  const lastBuildDate =
    typeof parsed.lastBuildDate === "string"
      ? parsed.lastBuildDate
      : undefined;
  return parsePublishedAt(pubDate) || parsePublishedAt(lastBuildDate);
}

export async function fetchFeedMetadata(url: string): Promise<{
  title: string;
  description: string | null;
}> {
  try {
    const feed = await fetchRssFeed(url, rssParser);

    const title = feed.title?.trim() || "";
    const raw =
      feed.description?.trim() ||
      feed.itunes?.summary?.trim() ||
      null;
    const description = raw ? stripHtml(raw).slice(0, 500) || null : null;

    return { title, description };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch feed metadata: ${message}`);
  }
}

export async function fetchFeed(feed: Feed): Promise<{
  newItems: any[];
  error?: string;
}> {
  const currentInterval =
    feed.fetch_interval_min || DEFAULT_FETCH_INTERVAL_MIN;

  try {
    const parsed = await fetchRssFeed(feed.url, rssParser);
    const rawItems = parsed.items ?? [];
    const entries = rawItems
      .map(toStoredItem)
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const knownGuids = parseFeedGuids(feed.last_guids);
    const candidates = entries.filter((entry) => !knownGuids.has(entry.guid));
    const enriched = await enrichItemsContent(candidates);
    const filtered = await filterItems(enriched);
    const inserted = addItems(feed.id, filtered);
    if (inserted.length > 0) emitNewItems(inserted);

    const nextInterval = nextFetchIntervalMin(
      currentInterval,
      inserted.length,
      rawItems,
    );
    let lastPublishedAt = maxPublishedAt(entries);
    if (lastPublishedAt && feed.last_published_at) {
      const next = Date.parse(lastPublishedAt);
      const prev = Date.parse(feed.last_published_at);
      if (!Number.isNaN(prev) && (Number.isNaN(next) || prev > next)) {
        lastPublishedAt = feed.last_published_at;
      }
    }
    updateFeedFetchState(feed.id, {
      next_fetched_at: nextFetchedAtIso(nextInterval),
      fetch_interval_min: nextInterval,
      ...(lastPublishedAt ? { last_published_at: lastPublishedAt } : {}),
      last_build_date: feedBuildDate(parsed),
      last_guids: serializeFeedGuids(entries.map((entry) => entry.guid)),
    });

    return { newItems: inserted };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { newItems: [], error: `${feed.title}: ${message}` };
  }
}

export async function fetchDueFeeds(label: string): Promise<{
  feeds: number;
  newItems: number;
  errors: string[];
}> {
  const started = Date.now();
  const feeds = getDueFeeds();

  let newItemsCount = 0;
  const errors: string[] = [];

  for (const feed of feeds) {
    const result = await fetchFeed(feed);
    newItemsCount += result.newItems.length;
    if (result.error) errors.push(result.error);
  }

  const result = {
    feeds: feeds.length,
    newItems: newItemsCount,
    errors,
  };

  console.log(
    `[fetch:${label}] due=${result.feeds} new=${result.newItems} ${Date.now() - started}ms`,
  );

  for (const error of result.errors) {
    console.error(`[fetch:${label}] ${error}`);
  }

  return result;
}
