import {
  and,
  desc,
  eq,
  gte,
  lt,
  lte,
  or,
} from "drizzle-orm";
import { db } from "./database";
import { getFeed } from "./feeds";
import { feeds, items, DEFAULT_LIMIT, MAX_LIMIT } from "./schema";
import { newItemId, decodeCursor, parseTimeRange, TimeUnit, toUtcIso } from "./utils";

export function getItems(options?: {
  since?: string;
  until?: string;
  unit?: string;
  count?: number;
  keyword?: string;
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

    const timeRange = options?.unit && options?.count ? parseTimeRange(options.unit, options.count) : undefined;
    const timeFilter = timeRange ? and(
      gte(items.published_at, timeRange.since),
      lte(items.published_at, timeRange.until),
    ) : undefined;

    const cursorFilter = decoded
      ? or(
          lt(items.published_at, decoded.sortTime),
          and(eq(items.published_at, decoded.sortTime), lt(items.id, decoded.id)),
        )
      : undefined;

    const readFilter = options?.isRead ? eq(items.is_read, options.isRead) : undefined;
    const passedFilter =
      options?.filterPassed === 0 || options?.filterPassed === 1
        ? eq(items.filter_passed, options.filterPassed)
        : eq(items.filter_passed, 1);

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
        matched_keywords: items.matched_keywords,
        pass_reason: items.pass_reason,
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

export function addItems(
  feedId: string,
  newItems: {
    guid: string;
    title: string;
    link: string;
    content: string | null;
    published_at: string;
    filter_passed: number;
    matched_keywords: string | null;
    pass_reason: string | null;
  }[],
): any[] {

  try {

    const feed = getFeed(feedId);

    if (!feed) {
      throw new Error(`Feed ${feedId} not found`);
    }

    const feed_title = feed.title;

    let insertedItems = [];

    for (const newItem of newItems) {

      const id = newItemId();
      const { filter_passed, matched_keywords, pass_reason } = newItem;

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
          matched_keywords,
          pass_reason,
        })
        .onConflictDoNothing({ target: [items.feed_id, items.guid] })
        .returning()
        .get();


      if (inserted) {
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

export function clearItems(): void {
  try {
    const cutoff = new Date(Date.now() - 90 * TimeUnit.DAY).toISOString();
    db.delete(items).where(lt(items.published_at, cutoff)).run();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to clear items: ${detail}`);
  }
}