import {
  desc,
  eq,
  isNull,
  like,
  lt,
  and,
  or,
  sql,
} from "drizzle-orm";
import { db } from "./database";
import { feeds, type Feed, DEFAULT_LIMIT, MAX_LIMIT } from "./schema";
import { decodeCursor, feedIdFromUrl } from "./utils";

export function getFeeds( 
  options?: {
    cursor?: string;
    limit?: number;
    keyword?: string;
  }
): Feed[] {

  try {

    const decoded = options?.cursor ? decodeCursor(options.cursor) : null;
    if (options?.cursor && !decoded) {
      throw new Error(`Invalid cursor: ${options.cursor}`);
    }

    const cursorFilter = decoded
      ? or(
          lt(feeds.updated_at, decoded.sortTime),
          and(eq(feeds.updated_at, decoded.sortTime), lt(feeds.id, decoded.id)),
        )
      : undefined;

    const adjustedLimit = Math.min(
      Math.max(options?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const keyword = options?.keyword?.trim();

    const feedFilter = keyword
      ? like(feeds.title, `%${keyword}%`)
      : undefined;

    const selected = db
      .select()
      .from(feeds)
      .where(and(cursorFilter, feedFilter))
      .orderBy(desc(feeds.updated_at), desc(feeds.id))
      .limit(adjustedLimit + 1)
      .all();

    return selected
  
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get feeds: ${detail}`);
  }
}

export function getFeed(id: string): Feed | null {

  try {

    const selected = db.select()
    .from(feeds)
    .where(eq(feeds.id, id))
    .get()

    if (!selected) {
      return null;
    }

    return selected;

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get feed: ${detail}`);
  }
}

export function createFeed(
  input: {
    title: string;
    url: string;
    description?: string | null;
  }
): Feed {

  try {

    const id = feedIdFromUrl(input.url);

    const existing = getFeed(id);
    if (existing) {
      return existing;
    }

    const created = db.insert(feeds)
      .values({
        id,
        title: input.title,
        url: input.url,
        description: input.description ?? null,
      })
      .returning()
      .get();

    return created;
      
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create feed: ${detail}`);
  }
}

export function updateFeed(
  id: string,
  input: {
    title?: string;
    url?: string;
    description?: string | null;
  },
): Feed {

  try {

    const existing = getFeed(id);

    if (!existing) {
      throw new Error("Feed does not exist");
    }

    const title = input.title ?? existing.title;
    const description =
      input.description !== undefined ? input.description : existing.description;

    const updated = db.update(feeds)
      .set({
        title,
        description,
        updated_at: sql`datetime('now')`,
      })
      .where(eq(feeds.id, id))
      .returning()
      .get();

    return updated;

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update feed: ${detail}`);
  }
}

export function deleteFeed(id: string): boolean {

  try {

    const existing = getFeed(id);

    if (!existing) {
      throw new Error("Feed does not exist");
    }

    db.delete(feeds)
    .where(eq(feeds.id, id))
    .run();

    return true;

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to delete feed: ${detail}`);
  }
}


// About fetching

export function getDueFeeds(): Feed[] {

  try {

    const selected = db
      .select()
      .from(feeds)
      .where(
        or(
          isNull(feeds.next_fetched_at),
          sql`datetime(${feeds.next_fetched_at}) <= datetime('now')`,
        ),
      )
      .orderBy(sql`COALESCE(${feeds.next_fetched_at}, '1970-01-01')`)
      .all();

    return selected;

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get due feeds: ${detail}`);
  }
}

export function updateFeedFetchState(
  id: string,
  input: { 
    next_fetched_at: string;
    fetch_interval_min: number;
  },
): void {

  try {

    db.update(feeds)
      .set({
        next_fetched_at: input.next_fetched_at,
        fetch_interval_min: input.fetch_interval_min,
      })
      .where(eq(feeds.id, id))
    .run();

  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update feed fetch state: ${detail}`);
  }
}

