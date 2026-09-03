import {
  and,
  desc,
  eq,
  gte,
  inArray,
  lt,
  lte,
  or,
} from "drizzle-orm";
import { db } from "./database";
import { getFeed } from "./feeds";
import { feeds, items, uningestedItems, DEFAULT_LIMIT, MAX_LIMIT } from "./schema";
import { newItemId, decodeCursor, parseItemId, parseTimeRange, TimeUnit, toUtcIso } from "./utils";

const COMMON_SECOND_LEVEL_SUFFIXES = new Set([
  "ac", "co", "com", "edu", "firm", "gen", "go", "gob", "gov", "ind",
  "mil", "net", "ne", "nom", "or", "org", "sch",
]);

/** Return the registrable-looking domain used as an item's source. */
export function sourceFromLink(link: string): string {
  try {
    const hostname = new URL(link).hostname.toLowerCase().replace(/^www\./, "");
    if (!hostname || hostname === "localhost" || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) {
      return hostname;
    }

    const labels = hostname.split(".");
    if (
      labels.length > 2 &&
      labels.at(-1)!.length === 2 &&
      COMMON_SECOND_LEVEL_SUFFIXES.has(labels.at(-2)!)
    ) {
      return labels.slice(-3).join(".");
    }
    return labels.length > 2 ? labels.slice(-2).join(".") : hostname;
  } catch {
    return "";
  }
}

type ItemQueryOptions = {
  since?: string;
  until?: string;
  unit?: string;
  count?: number;
  isRead?: number;
  status?: "passed" | "rejected" | "deleted";
  cursor?: string;
  limit?: number;
};

export function getItems(options?: ItemQueryOptions): any[] {

  try {

    const decoded = options?.cursor ? decodeCursor(options.cursor) : null;
    if (options?.cursor && !decoded) {
      throw new Error(`Invalid cursor: ${options.cursor}`);
    }
    const cursorId = decoded ? parseItemId(decoded.id) : null;
    if (decoded && cursorId === null) {
      throw new Error(`Invalid cursor: ${options?.cursor}`);
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
          and(eq(items.published_at, decoded.sortTime), lt(items.id, cursorId!)),
        )
      : undefined;

    const readFilter =
      options?.isRead === 0 || options?.isRead === 1
        ? eq(items.is_read, options.isRead)
        : undefined;
    const statusFilter = eq(items.status, options?.status ?? "passed");

    const selected = db
      .select({
        id: items.id,
        feed_id: items.feed_id,
        guid: items.guid,
        title: items.title,
        link: items.link,
        source: items.source,
        content: items.content,
        cover: items.cover,
        published_at: items.published_at,
        is_read: items.is_read,
        created_at: items.created_at,
        feed_title: feeds.title,
      })
      .from(items)
      .innerJoin(feeds, eq(items.feed_id, feeds.id))
      .where(and(timeFilter, cursorFilter, readFilter, statusFilter))
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

/** Returns the stored cover for a visible item. Used by the same-origin cover proxy. */
export function getItemCover(id: number): string | null {
  try {
    const row = db
      .select({ cover: items.cover })
      .from(items)
      .where(and(eq(items.id, id), eq(items.status, "passed")))
      .get();
    return row?.cover ?? null;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get item cover: ${detail}`);
  }
}

export function getItemsForExport(options: {
  since?: string;
  until?: string;
}): { published_at: string; title: string; content: string | null; link: string }[] {
  try {
    const sinceFilter = options.since
      ? gte(items.published_at, options.since)
      : undefined;
    const untilFilter = options.until
      ? lte(items.published_at, options.until)
      : undefined;
    const statusFilter = eq(items.status, "passed");

    return db
      .select({
        published_at: items.published_at,
        title: items.title,
        content: items.content,
        link: items.link,
      })
      .from(items)
      .where(and(sinceFilter, untilFilter, statusFilter))
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
  feedId: number,
  newItems: {
    guid: string;
    title: string;
    link: string;
    content: string | null;
    cover: string | null;
    published_at: string;
    status: "passed" | "rejected" | "deleted";
    status_reason: string | null;
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
      const { status, status_reason } = newItem;

      const inserted = db.transaction((tx) => {
        const item = tx.insert(items)
          .values({
            id,
            feed_id: feedId,
            guid: newItem.guid,
            title: newItem.title,
            link: newItem.link,
            source: sourceFromLink(newItem.link),
            content: newItem.content,
            cover: newItem.cover,
            published_at: newItem.published_at,
            is_read: 0,
            status,
            status_reason,
          })
          .onConflictDoNothing({ target: items.guid })
          .returning()
          .get();

        if (item?.status === "passed") {
          tx.insert(uningestedItems).values({ item_id: item.id }).run();
        }

        return item;
      });


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

export function markItemsRead(until: string): void {
  
  try {

    db.update(items)
    .set({ is_read: 1 })
    .where(
      and(
        lte(items.published_at, until),
        eq(items.is_read, 0),
        eq(items.status, "passed"),
      ),
    )
    .run();

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to mark items as read: ${detail}`);
  }
}

export function deleteItem(id: number, reason: string): boolean {
  try {
    const deletedReason = reason.trim();
    if (!deletedReason) {
      throw new Error("Delete reason is required");
    }

    const existing = db
      .select({ id: items.id, status: items.status })
      .from(items)
      .where(eq(items.id, id))
      .get();

    if (!existing) {
      throw new Error("Item does not exist");
    }

    if (existing.status === "deleted") {
      throw new Error("Item is already deleted");
    }

    db.update(items)
      .set({ status: "deleted", status_reason: deletedReason })
      .where(eq(items.id, id))
      .run();

    db.delete(uningestedItems).where(eq(uningestedItems.item_id, id)).run();

    return true;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete item ${id}: ${detail}`);
  }
}

/** Soft-delete every visible item from a source after it is blocked. */
export function deleteItemsBySource(source: string): number {
  try {
    const normalizedSource = source.trim().toLocaleLowerCase();
    if (!normalizedSource) {
      throw new Error("Source is required");
    }

    const result = db
      .update(items)
      .set({
        status: "deleted",
        status_reason: `Source filter: ${normalizedSource}`,
      })
      .where(
        and(
          eq(items.source, normalizedSource),
          eq(items.status, "passed"),
        ),
      )
      .run();

    db.delete(uningestedItems)
      .where(
        inArray(
          uningestedItems.item_id,
          db.select({ id: items.id })
            .from(items)
            .where(eq(items.source, normalizedSource)),
        ),
      )
      .run();

    return result.changes;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete items from source: ${detail}`);
  }
}

export function markItemRead(id: number): void {

  try {

    db.update(items)
    .set({ is_read: 1 })
    .where(and(eq(items.id, id), eq(items.is_read, 0), eq(items.status, "passed")))
    .run();

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to mark item ${id} as read: ${detail}`);
  }
}

/**
 * Takes queued, visible items for MCP consumption.
 */
export function takeUningestedItems(options: Pick<ItemQueryOptions, "since" | "until" | "unit" | "count" | "limit">): {
  items: any[];
  hasMore: boolean;
} {
  try {
    const requestedLimit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const relativeRange = options.unit && options.count
      ? parseTimeRange(options.unit, options.count)
      : undefined;
    const since = options.since ?? relativeRange?.since;
    const until = options.until ?? relativeRange?.until;
    const timeFilter = since || until
      ? and(
          since ? gte(items.published_at, since) : undefined,
          until ? lte(items.published_at, until) : undefined,
        )
      : undefined;

    const selected = db
      .select({
        id: items.id,
        feed_id: items.feed_id,
        guid: items.guid,
        title: items.title,
        link: items.link,
        source: items.source,
        content: items.content,
        cover: items.cover,
        published_at: items.published_at,
        is_read: items.is_read,
        created_at: items.created_at,
        feed_title: feeds.title,
      })
      .from(uningestedItems)
      .innerJoin(items, eq(uningestedItems.item_id, items.id))
      .innerJoin(feeds, eq(items.feed_id, feeds.id))
      .where(and(timeFilter, eq(items.status, "passed")))
      .orderBy(desc(items.published_at), desc(items.id))
      .limit(requestedLimit + 1)
      .all();

    const hasMore = selected.length > requestedLimit;
    const taken = selected.slice(0, requestedLimit).map((item) => ({
      ...item,
      created_at: toUtcIso(item.created_at),
    }));

    if (taken.length > 0) {
      db.delete(uningestedItems)
        .where(inArray(uningestedItems.item_id, taken.map((item) => item.id)))
        .run();
    }

    return { items: taken, hasMore };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to take uningested items: ${detail}`);
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
