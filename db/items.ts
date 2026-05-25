import {
  and,
  desc,
  eq,
  gte,
  like,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "./database";
import { feeds, items, type Item } from "./schema";
import { newItemId, encodeCursor, decodeCursor } from "./utils";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export type ItemWithFeed = Item & {
  feed_title: string;
};

export type ItemsPage = {
  data: ItemWithFeed[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ItemInput = {
  guid: string;
  title: string;
  link: string;
  description: string;
  published_at: string;
};

const itemWithFeedSelect = {
  id: items.id,
  feed_id: items.feed_id,
  guid: items.guid,
  title: items.title,
  link: items.link,
  description: items.description,
  published_at: items.published_at,
  is_read: items.is_read,
  created_at: items.created_at,
  feed_title: feeds.title,
};

function itemWithFeedQuery() {
  return db
    .select(itemWithFeedSelect)
    .from(items)
    .innerJoin(feeds, eq(items.feed_id, feeds.id));
}

export function insertItems(
  feedId: string,
  inputItems: ItemInput[],
): ItemWithFeed[] {

  const feedRow = db
    .select({ title: feeds.title })
    .from(feeds)
    .where(eq(feeds.id, feedId))
    .get();

  const feed_title = feedRow?.title ?? "";
  const insertedItems: ItemWithFeed[] = [];

  for (const inputItem of inputItems) {

    const id = newItemId();
    const created_at = new Date().toISOString();

    const inserted = db
      .insert(items)
      .values({
        id,
        feed_id: feedId,
        guid: inputItem.guid,
        title: inputItem.title,
        link: inputItem.link,
        description: inputItem.description,
        published_at: inputItem.published_at,
        is_read: 0,
      })
      .onConflictDoNothing({ target: [items.feed_id, items.guid] })
      .returning()
      .get();

    if (inserted) {
      insertedItems.push({
        id,
        feed_id: feedId,
        guid: inputItem.guid,
        title: inputItem.title,
        link: inputItem.link,
        description: inputItem.description,
        published_at: inputItem.published_at,
        is_read: 0,
        created_at,
        feed_title,
      });
    }
  }
  return insertedItems;
}

export function markItemsRead(until: string): void {
  
  try {

    db.update(items)
    .set({ is_read: 1 })
    .where(and(lte(items.published_at, until), eq(items.is_read, 0)))
    .run();

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to mark items as read: ${detail}`);
  }
}

export function markItemRead(id: string): void {

  try {

    db.update(items)
    .set({ is_read: 1 })
    .where(and(eq(items.id, id), eq(items.is_read, 0)))
    .run();

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to mark item ${id} as read: ${detail}`);
  }
}

export type TimeUnit = "minute" | "hour" | "day";

const UNIT_MS: Record<TimeUnit, number> = {
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
};

const MAX_WINDOW_MS = 30 * UNIT_MS.day;

export function parseTimeUnit(value: string): TimeUnit | null {
  switch (value) {
    case "minute":
    case "min":
    case "分":
      return "minute";
    case "hour":
    case "h":
    case "时":
      return "hour";
    case "day":
    case "d":
    case "天":
      return "day";
    default:
      return null;
  }
}

export function resolveTimeRange(
  options:
    | { since: string; until: string }
    | { unit: TimeUnit; count: number },
): { since: string; until: string } {
  if ("since" in options) {
    return { since: options.since, until: options.until };
  }

  const windowMs = options.count * UNIT_MS[options.unit];
  if (windowMs > MAX_WINDOW_MS) {
    throw new Error("Time window cannot exceed 30 days");
  }

  const until = new Date().toISOString();
  const since = new Date(Date.now() - windowMs).toISOString();
  return { since, until };
}

export function listItemsInTimeRange(options: {
  since: string;
  until: string;
  cursor?: string;
  limit?: number;
}): ItemsPage {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const decoded = options.cursor ? decodeCursor(options.cursor) : null;
  if (options.cursor && !decoded) {
    throw new Error(`Invalid cursor: ${options.cursor}`);
  }

  const timeFilter = and(
    gte(items.published_at, options.since),
    lte(items.published_at, options.until),
  );

  const query = itemWithFeedQuery().orderBy(
    desc(items.published_at),
    desc(items.id),
  );

  const rows = decoded
    ? query
        .where(
          and(
            timeFilter,
            or(
              lt(items.published_at, decoded.publishedAt),
              and(
                eq(items.published_at, decoded.publishedAt),
                lt(items.id, decoded.id),
              ),
            ),
          ),
        )
        .limit(limit + 1)
        .all()
    : query.where(timeFilter).limit(limit + 1).all();

  const data = rows
    .map((row) => ({ ...row, feed_title: row.feed_title ?? "" }))
    .slice(0, rows.length > limit ? limit : rows.length);
  const hasMore = rows.length > limit;
  const last = data.at(-1);
  const nextCursor =
    hasMore && last ? encodeCursor(last.published_at, last.id) : null;

  return { data, nextCursor, hasMore };
}

export function listUnreadItems(options: {
  unit: TimeUnit;
  count: number;
  cursor?: string;
  limit?: number;
}): ItemsPage {
  const { since, until } = resolveTimeRange(options);
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const decoded = options.cursor ? decodeCursor(options.cursor) : null;
  if (options.cursor && !decoded) {
    throw new Error(`Invalid cursor: ${options.cursor}`);
  }

  const filter = and(
    gte(items.published_at, since),
    lte(items.published_at, until),
    eq(items.is_read, 0),
  );

  const query = itemWithFeedQuery().orderBy(
    desc(items.published_at),
    desc(items.id),
  );

  const rows = decoded
    ? query
        .where(
          and(
            filter,
            or(
              lt(items.published_at, decoded.publishedAt),
              and(
                eq(items.published_at, decoded.publishedAt),
                lt(items.id, decoded.id),
              ),
            ),
          ),
        )
        .limit(limit + 1)
        .all()
    : query.where(filter).limit(limit + 1).all();

  const data = rows
    .map((row) => ({ ...row, feed_title: row.feed_title ?? "" }))
    .slice(0, rows.length > limit ? limit : rows.length);
  const hasMore = rows.length > limit;
  const last = data.at(-1);
  const nextCursor =
    hasMore && last ? encodeCursor(last.published_at, last.id) : null;

  return { data, nextCursor, hasMore };
}

export function getItems(options?: {
  cursor?: string;
  limit?: number;
}): ItemWithFeed[] {

  try {
  
    const limit = Math.min(
      Math.max(options?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const decoded = options?.cursor ? decodeCursor(options.cursor) : null;

    const query = itemWithFeedQuery().orderBy(
      desc(items.published_at),
      desc(items.id),
    );

    const selected = decoded
      ? query
          .where(
            or(
              lt(items.published_at, decoded.publishedAt),
              and(
                eq(items.published_at, decoded.publishedAt),
                lt(items.id, decoded.id),
              ),
            ),
          )
          .limit(limit + 1)
          .all()
      : query.limit(limit + 1).all();

    return selected;
  
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get items: ${detail}`);
  }
}

export function searchItems(options: {
  keyword: string;
  since: string;
  until: string;
  cursor?: string;
  limit?: number;
}): ItemsPage {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const decoded = options.cursor ? decodeCursor(options.cursor) : null;
  if (options.cursor && !decoded) {
    throw new Error(`Invalid cursor: ${options.cursor}`);
  }

  const pattern = `%${options.keyword}%`;
  const searchFilter = and(
    gte(items.published_at, options.since),
    lte(items.published_at, options.until),
    or(
      like(items.title, pattern),
      like(sql`IFNULL(${items.description}, '')`, pattern),
    ),
  );

  const query = itemWithFeedQuery().orderBy(
    desc(items.published_at),
    desc(items.id),
  );

  const rows = decoded
    ? query
        .where(
          and(
            searchFilter,
            or(
              lt(items.published_at, decoded.publishedAt),
              and(
                eq(items.published_at, decoded.publishedAt),
                lt(items.id, decoded.id),
              ),
            ),
          ),
        )
        .limit(limit + 1)
        .all()
    : query.where(searchFilter).limit(limit + 1).all();

  const data = rows
    .map((row) => ({ ...row, feed_title: row.feed_title ?? "" }))
    .slice(0, rows.length > limit ? limit : rows.length);
  const hasMore = rows.length > limit;
  const last = data.at(-1);
  const nextCursor =
    hasMore && last ? encodeCursor(last.published_at, last.id) : null;

  return { data, nextCursor, hasMore };
}
