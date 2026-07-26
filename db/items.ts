import {
  and,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { hasFilterPrompt } from "../filter";
import { db } from "./database";
import { getFeed } from "./feeds";
import { feeds, items, DEFAULT_LIMIT, MAX_LIMIT } from "./schema";
import { newItemId, decodeCursor, parseTimeRange, TimeUnit, toUtcIso } from "./utils";

function buildPassedFilter(filterPassed?: number) {
  const filtering = hasFilterPrompt();
  if (!filtering) {
    return filterPassed === 0 ? sql`1 = 0` : undefined;
  }

  if (filterPassed === 0) {
    return isNull(items.filter_passed);
  }
  if (filterPassed === 1) {
    return isNotNull(items.filter_passed);
  }
  return undefined;
}

export function getItems(options?: {
  since?: string;
  until?: string;
  unit?: string;
  count?: number;
  isRead?: number;
  filterPassed?: number;
  cursor?: string;
  limit?: number;
}): any[] {

  try {

    const decoded = options?.cursor ? decodeCursor(options.cursor) : null;
    if (options?.cursor && !decoded) {
      throw new Error(`Invalid cursor: ${options.cursor}`);
    }

    const adjustedLimit = Math.min(
      Math.max(options?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const relativeRange =
      options?.unit && options?.count
        ? parseTimeRange(options.unit, options.count)
        : undefined;
    const since = options?.since ?? relativeRange?.since;
    const until = options?.until ?? relativeRange?.until;
    const timeFilter =
      since || until
        ? and(
            since ? gte(items.published_at, since) : undefined,
            until ? lte(items.published_at, until) : undefined,
          )
        : undefined;

    const cursorFilter = decoded
      ? or(
          lt(items.published_at, decoded.sortTime),
          and(eq(items.published_at, decoded.sortTime), lt(items.id, decoded.id)),
        )
      : undefined;

    const readFilter =
      options?.isRead === 0 || options?.isRead === 1
        ? eq(items.is_read, options.isRead)
        : undefined;
    const passedFilter = buildPassedFilter(options?.filterPassed);

    const selected = db
      .select({
        id: items.id,
        feed_id: items.feed_id,
        guid: items.guid,
        title: items.title,
        link: items.link,
        content: items.content,
        published_at: items.published_at,
        is_read: items.is_read,
        filter_passed: items.filter_passed,
        created_at: items.created_at,
        feed_title: feeds.title,
      })
      .from(items)
      .innerJoin(feeds, eq(items.feed_id, feeds.id))
      .where(and(timeFilter, cursorFilter, readFilter, passedFilter))
      .orderBy(desc(items.published_at), desc(items.id))
      .limit(adjustedLimit + 1)
      .all();

    return selected.map((row) => ({
      ...row,
      created_at: toUtcIso(row.created_at),
    }));
  
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get items: ${detail}`);
  }
}

export function getItemsForExport(options: {
  since?: string;
  until?: string;
  filterPassed?: number;
}): { published_at: string; title: string; content: string | null; link: string }[] {
  try {
    const sinceFilter = options.since
      ? gte(items.published_at, options.since)
      : undefined;
    const untilFilter = options.until
      ? lte(items.published_at, options.until)
      : undefined;
    const passedFilter = buildPassedFilter(options.filterPassed);

    return db
      .select({
        published_at: items.published_at,
        title: items.title,
        content: items.content,
        link: items.link,
      })
      .from(items)
      .where(and(sinceFilter, untilFilter, passedFilter))
      .orderBy(desc(items.published_at), desc(items.id))
      .all();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to export items: ${detail}`);
  }
}

export function getExistingGuids(guids: string[]): Set<string> {
  if (guids.length === 0) return new Set();

  const rows = db
    .select({ guid: items.guid })
    .from(items)
    .where(inArray(items.guid, guids))
    .all();

  return new Set(rows.map((row) => row.guid));
}

export function addItems(
  feedId: string,
  newItems: {
    guid: string;
    title: string;
    link: string;
    content: string | null;
    published_at: string;
    filter_passed: string | null;
  }[],
): any[] {

  try {

    const feed = getFeed(feedId);

    if (!feed) {
      throw new Error(`Feed ${feedId} not found`);
    }

    const feed_title = feed.title;
    const existingGuids = getExistingGuids(newItems.map((item) => item.guid));

    let insertedItems = [];

    for (const newItem of newItems) {
      if (existingGuids.has(newItem.guid)) continue;

      const id = newItemId();
      const { filter_passed } = newItem;

      const inserted = db.insert(items)
        .values({
          id,
          feed_id: feedId,
          guid: newItem.guid,
          title: newItem.title,
          link: newItem.link,
          content: newItem.content,
          published_at: newItem.published_at,
          is_read: 0,
          filter_passed,
        })
        .onConflictDoNothing({ target: items.guid })
        .returning()
        .get();


      if (inserted) {
        existingGuids.add(inserted.guid);
        insertedItems.push({
          ...inserted,
          created_at: toUtcIso(inserted.created_at),
          feed_title,
        });
      }
    }

    return insertedItems;

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to add items: ${detail}`);
  }
}

export function markItemsRead(
  until: string,
  options?: {
    filterPassed?: number;
  },
): void {
  
  try {

    const passedFilter = buildPassedFilter(options?.filterPassed);

    db.update(items)
    .set({ is_read: 1 })
    .where(
      and(
        lte(items.published_at, until),
        eq(items.is_read, 0),
        passedFilter,
      ),
    )
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

export function clearItems(): void {
  try {
    const cutoff = new Date(Date.now() - 90 * TimeUnit.DAY).toISOString();
    db.delete(items).where(lt(items.published_at, cutoff)).run();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to clear items: ${detail}`);
  }
}
