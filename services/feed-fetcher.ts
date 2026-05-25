import Parser from "rss-parser";
import { insertItems, type ItemInput } from "../db/items";
import { getDueFeeds, updateFeedFetchState } from "../db/feeds";
import type { Feed } from "../db/schema";
import { emitNewItems } from "../sse/streamer";
import { httpGet } from "./http-fetcher";

const RSS_USER_AGENT = "NanoFlux/1.0 (+https://github.com/nanoflux)";
const RSS_TIMEOUT_MS = 15_000;

const rssParser = new Parser();

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MIN_INTERVAL_MIN = 5;
const MAX_INTERVAL_MIN = 30;
const DEFAULT_INTERVAL_MIN = 15;

export type FetchResult = {
  feeds: number;
  newItems: number;
  errors: string[];
};

function toItemInput(entry: Parser.Item): ItemInput | null {
  const link = entry.link?.trim();
  if (!link) return null;

  const title = entry.title?.trim() || link;
  const guid = (entry.guid || link).trim();
  const description =
    entry.contentSnippet?.trim() ||
    entry.summary?.trim() ||
    entry.content?.trim().slice(0, 2000) ||
    "";
  const published_at = entry.isoDate || entry.pubDate || "";
  return { guid, title, link, description, published_at };
}

function medianPublishGapSec(feedItems: Parser.Item[]): number | null {
  const now = Date.now();
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  const times = feedItems
    .map((entry) => {
      const d = entry.isoDate || entry.pubDate;
      return d ? Date.parse(d) : NaN;
    })
    .filter((t) => !Number.isNaN(t) && now - t <= maxAgeMs)
    .sort((a, b) => b - a);

  const gaps: number[] = [];
  for (let i = 0; i < times.length - 1; i++) {
    gaps.push(times[i]! - times[i + 1]!);
  }
  if (gaps.length === 0) return null;

  gaps.sort((a, b) => a - b);
  const mid = Math.floor(gaps.length / 2);
  const medianMs =
    gaps.length % 2 === 0
      ? (gaps[mid - 1]! + gaps[mid]!) / 2
      : gaps[mid]!;
  return Math.round(medianMs / 1000);
}

function clampIntervalMin(minutes: number): number {
  return Math.min(MAX_INTERVAL_MIN, Math.max(MIN_INTERVAL_MIN, minutes));
}

function nextFetchedAtIso(intervalMin: number): string {
  return new Date(Date.now() + intervalMin * 60_000).toISOString();
}

function nextFetchIntervalMin(
  currentMin: number,
  newItems: number,
  feedItems: Parser.Item[],
): number {
  const medianGapSec = medianPublishGapSec(feedItems);
  let targetMin = currentMin;

  if (medianGapSec !== null) {
    // Poll at roughly one-third of the typical publish interval.
    targetMin = clampIntervalMin(Math.round(medianGapSec / 3 / 60));
  }

  if (newItems > 0) {
    targetMin = Math.min(
      targetMin,
      clampIntervalMin(
        Math.round(currentMin * (newItems >= 2 ? 0.65 : 0.8)),
      ),
    );
  } else {
    targetMin = Math.max(
      targetMin,
      clampIntervalMin(Math.round(currentMin * 1.25)),
    );
  }

  return clampIntervalMin(targetMin);
}

async function fetchAndParseRss(url: string) {
  const response = await httpGet(url, {
    headers: { "User-Agent": RSS_USER_AGENT },
    signal: AbortSignal.timeout(RSS_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return rssParser.parseString(await response.text());
}

export async function fetchFeedMetadata(url: string): Promise<{
  title: string;
  description: string | null;
}> {
  try {

    const feed = await fetchAndParseRss(url);

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
  newItems: number;
  error?: string;
}> {
  const currentInterval =
    feed.fetch_interval_min || DEFAULT_INTERVAL_MIN;

  try {
    const parsed = await fetchAndParseRss(feed.url);
    const items = (parsed.items ?? [])
      .map(toItemInput)
      .filter((entry): entry is ItemInput => entry !== null);

    const inserted = insertItems(feed.id, items);
    if (inserted.length > 0) emitNewItems(inserted);

    const nextInterval = nextFetchIntervalMin(
      currentInterval,
      inserted.length,
      parsed.items ?? [],
    );

    updateFeedFetchState(feed.id, {
      fetch_interval_min: nextInterval,
      next_fetched_at: nextFetchedAtIso(nextInterval),
    });

    return { newItems: inserted.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const retryInterval = clampIntervalMin(
      Math.round(currentInterval * 1.1),
    );
    updateFeedFetchState(feed.id, {
      fetch_interval_min: retryInterval,
      next_fetched_at: nextFetchedAtIso(retryInterval),
    });
    return { newItems: 0, error: `${feed.title}: ${message}` };
  }
}

export async function fetchDueFeeds(label: string): Promise<FetchResult> {
  const started = Date.now();
  const feeds = getDueFeeds();
  let newItems = 0;
  const errors: string[] = [];

  for (const feed of feeds) {
    const result = await fetchFeed(feed);
    newItems += result.newItems;
    if (result.error) errors.push(result.error);
  }

  const result: FetchResult = {
    feeds: feeds.length,
    newItems,
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
