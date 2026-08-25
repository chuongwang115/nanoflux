import { and, eq, gt, inArray, lt, lte, desc, asc, sql } from "drizzle-orm";
import { getAllFeeds } from "./feeds";
import { db } from "./database";
import { items } from "./schema";
import type { Feed } from "./schema";

const FEVER_ITEM_LIMIT = 50;
export const FEVER_GROUP_ID = 1;
export const FEVER_GROUP_TITLE = "NanoFlux";
export const FEVER_FAVICON_ID = 1;

export type FeverFeed = {
  id: number;
  favicon_id: number;
  title: string;
  url: string;
  site_url: string;
  is_spark: number;
  last_updated_on_time: number;
};

export type FeverItem = {
  id: number;
  feed_id: number;
  title: string;
  author: string;
  html: string;
  url: string;
  is_saved: number;
  is_read: number;
  created_on_time: number;
};

function toUnix(value: string | null | undefined): number {
  if (!value) return 0;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : Math.floor(time / 1000);
}

function siteUrlFromFeedUrl(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

function toFeverFeed(feed: Feed): FeverFeed {
  return {
    id: feed.id,
    favicon_id: FEVER_FAVICON_ID,
    title: feed.title,
    url: feed.url,
    site_url: siteUrlFromFeedUrl(feed.url),
    is_spark: 0,
    last_updated_on_time: toUnix(feed.last_published_at ?? feed.updated_at),
  };
}

export function listFeverFeeds(): FeverFeed[] {
  return getAllFeeds().map(toFeverFeed);
}

export function feverFeedsGroups(): { group_id: number; feed_ids: string }[] {
  const ids = listFeverFeeds()
    .map((feed) => feed.id)
    .join(",");
  return [{ group_id: FEVER_GROUP_ID, feed_ids: ids }];
}

export function lastRefreshedOnTime(): number {
  const feeds = getAllFeeds();
  let latest = 0;
  for (const feed of feeds) {
    const candidate = toUnix(feed.next_fetched_at ?? feed.last_published_at);
    if (candidate > latest) latest = candidate;
  }
  return latest || Math.floor(Date.now() / 1000);
}

function parseIdList(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((id) => Number.isSafeInteger(id) && id > 0)
    .slice(0, FEVER_ITEM_LIMIT);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>\n")}</p>`)
    .join("\n");
}

function feverItemHtml(content: string | null, cover: string | null): string {
  const body = textToHtml(content ?? "");
  const src = cover?.trim();
  if (!src) return body;
  const img = `<p><img src="${escapeHtml(src)}" alt=""></p>`;
  return body ? `${img}\n${body}` : img;
}

type ItemRow = {
  id: number;
  feed_id: number;
  title: string;
  link: string;
  source: string;
  content: string | null;
  cover: string | null;
  published_at: string;
  is_read: number;
};

function toFeverItem(row: ItemRow): FeverItem {
  return {
    id: row.id,
    feed_id: row.feed_id,
    title: row.title,
    author: row.source,
    html: feverItemHtml(row.content, row.cover),
    url: row.link,
    is_saved: 0,
    is_read: row.is_read ? 1 : 0,
    created_on_time: toUnix(row.published_at),
  };
}

const itemColumns = {
  id: items.id,
  feed_id: items.feed_id,
  title: items.title,
  link: items.link,
  source: items.source,
  content: items.content,
  cover: items.cover,
  published_at: items.published_at,
  is_read: items.is_read,
};

export function countFeverItems(): number {
  const row = db
    .select({ n: sql<number>`count(*)` })
    .from(items)
    .where(eq(items.is_deleted, 0))
    .get();
  return Number(row?.n ?? 0);
}

export function listFeverUnreadItemIds(): string {
  const rows = db
    .select({ id: items.id })
    .from(items)
    .where(and(eq(items.is_deleted, 0), eq(items.is_read, 0)))
    .orderBy(asc(items.id))
    .all();
  return rows.map((row) => String(row.id)).join(",");
}

function unixToIso(unix: number): string {
  return new Date(unix * 1000).toISOString();
}

export function markFeverReadState(options: {
  mark: string;
  as: string;
  id: number;
  before: number;
}): void {
  const kind = options.mark.trim().toLowerCase();
  const action = options.as.trim().toLowerCase();

  if (kind === "item") {
    if (options.id <= 0) return;
    if (action === "read") {
      db.update(items)
        .set({ is_read: 1 })
        .where(and(eq(items.id, options.id), eq(items.is_deleted, 0)))
        .run();
    } else if (action === "unread") {
      db.update(items)
        .set({ is_read: 0 })
        .where(and(eq(items.id, options.id), eq(items.is_deleted, 0)))
        .run();
    }
    return;
  }

  if (action !== "read") return;

  const beforeUnix = options.before > 0 ? options.before : Math.floor(Date.now() / 1000);
  const until = unixToIso(beforeUnix);

  if (kind === "feed") {
    if (options.id <= 0) return;
    db.update(items)
      .set({ is_read: 1 })
      .where(
        and(
          eq(items.feed_id, options.id),
          lte(items.published_at, until),
          eq(items.is_read, 0),
          eq(items.is_deleted, 0),
        ),
      )
      .run();
    return;
  }

  if (kind === "group" && options.id === FEVER_GROUP_ID) {
    db.update(items)
      .set({ is_read: 1 })
      .where(
        and(
          lte(items.published_at, until),
          eq(items.is_read, 0),
          eq(items.is_deleted, 0),
        ),
      )
      .run();
  }
}

export function listFeverItems(options: {
  sinceId?: number;
  maxId?: number;
  withIds?: string;
}): FeverItem[] {
  const withIds = parseIdList(options.withIds);
  const deletedFilter = eq(items.is_deleted, 0);

  if (withIds.length > 0) {
    const selected = db
      .select(itemColumns)
      .from(items)
      .where(and(deletedFilter, inArray(items.id, withIds)))
      .all();
    return selected.map(toFeverItem);
  }

  if (options.maxId && options.maxId > 0) {
    const selected = db
      .select(itemColumns)
      .from(items)
      .where(and(deletedFilter, lt(items.id, options.maxId)))
      .orderBy(desc(items.id))
      .limit(FEVER_ITEM_LIMIT)
      .all();
    return selected.map(toFeverItem);
  }

  if (options.sinceId && options.sinceId > 0) {
    const selected = db
      .select(itemColumns)
      .from(items)
      .where(and(deletedFilter, gt(items.id, options.sinceId)))
      .orderBy(asc(items.id))
      .limit(FEVER_ITEM_LIMIT)
      .all();
    return selected.map(toFeverItem);
  }

  const selected = db
    .select(itemColumns)
    .from(items)
    .where(deletedFilter)
    .orderBy(desc(items.id))
    .limit(FEVER_ITEM_LIMIT)
    .all();

  return selected.map(toFeverItem);
}
