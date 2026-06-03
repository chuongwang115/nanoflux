import {
  and,
  desc,
  eq,
  gte,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { getFilters } from "../filters";
import {
  isItemFilterPassed,
} from "../shared/passed-filters";
import { db } from "./database";
import { getFeed } from "./feeds";
import { feeds, items, DEFAULT_LIMIT, MAX_LIMIT } from "./schema";
import { newItemId, decodeCursor, parseTimeRange, TimeUnit, toUtcIso } from "./utils";

function buildPassedFilter(filterPassed?: number) {
  const hasFilters = getFilters().length > 0;
  if (!hasFilters) {
    return filterPassed === 0 ? sql`1 = 0` : undefined;
  }

  if (filterPassed === 0) {
    return isNull(items.passed_filters);
  }
  if (filterPassed === 1) {
    return isNotNull(items.passed_filters);
  }
  return undefined;
}

function buildPassedFilterIdFilter(filterId?: string) {
  const id = filterId?.trim();
  if (!id) return undefined;

  return sql`(
    ${items.passed_filters} IS NOT NULL
    AND (
      ${items.passed_filters} LIKE ${'%"id":"' + id + '"%'}
      OR ${items.passed_filters} = ${id}
      OR ${items.passed_filters} LIKE ${id + ",%"}
      OR ${items.passed_filters} LIKE ${"%," + id + ",%"}
      OR ${items.passed_filters} LIKE ${"%," + id}
    )
  )`;
}

export function getItems(options?: {
  since?: string;
  until?: string;
  unit?: string;
  count?: number;
  keyword?: string;
  isRead?: number;
  filterPassed?: number;
  passedFilterId?: string;
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

    const readFilter =
      options?.isRead === 0 || options?.isRead === 1
        ? eq(items.is_read, options.isRead)
        : undefined;
    const passedFilter = buildPassedFilter(options?.filterPassed);
    const passedFilterIdFilter = buildPassedFilterIdFilter(options?.passedFilterId);
    const hasFilters = getFilters().length > 0;

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
        passed_filters: items.passed_filters,
        created_at: items.created_at,
        feed_title: feeds.title,
      })
      .from(items)
      .innerJoin(feeds, eq(items.feed_id, feeds.id))
      .where(and(timeFilter, cursorFilter, readFilter, passedFilter, passedFilterIdFilter))
      .orderBy(desc(items.published_at), desc(items.id))
      .limit(adjustedLimit + 1)
      .all();

    return selected.map((row) => ({
      ...row,
      filter_passed: isItemFilterPassed(row.passed_filters, hasFilters),
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
    passed_filters: string | null;
  }[],
): any[] {

  try {

    const feed = getFeed(feedId);

    if (!feed) {
      throw new Error(`Feed ${feedId} not found`);
    }

    const feed_title = feed.title;
    const hasFilters = getFilters().length > 0;

    let insertedItems = [];

    for (const newItem of newItems) {

      const id = newItemId();
      const { passed_filters } = newItem;

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
          passed_filters,
        })
        .onConflictDoNothing({ target: [items.feed_id, items.guid] })
        .returning()
        .get();


      if (inserted) {
        insertedItems.push({
          ...inserted,
          filter_passed: isItemFilterPassed(inserted.passed_filters, hasFilters),
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
    passedFilterId?: string;
  },
): void {
  
  try {

    const passedFilter = buildPassedFilter(options?.filterPassed);
    const passedFilterIdFilter = buildPassedFilterIdFilter(options?.passedFilterId);

    db.update(items)
    .set({ is_read: 1 })
    .where(
      and(
        lte(items.published_at, until),
        eq(items.is_read, 0),
        passedFilter,
        passedFilterIdFilter,
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
