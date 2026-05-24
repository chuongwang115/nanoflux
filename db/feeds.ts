import {
  and,
  desc,
  eq,
  isNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "./database";
import { feeds, type Feed } from "./schema";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export function listFeeds(): Feed[] {
  return db
    .select()
    .from(feeds)
    .orderBy(desc(feeds.updated_at))
    .all();
}

export type FeedsPage = {
  data: Feed[];
  hasMore: boolean;
};

export function searchFeeds(options: {
  keyword: string;
  page?: number;
  limit?: number;
}): FeedsPage {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const page = Math.max(options.page ?? 1, 1);
  const offset = (page - 1) * limit;
  const pattern = `%${options.keyword}%`;

  const rows = db
    .select()
    .from(feeds)
    .where(like(feeds.title, pattern))
    .orderBy(desc(feeds.updated_at))
    .limit(limit + 1)
    .offset(offset)
    .all();

  const hasMore = rows.length > limit;
  const data = rows.slice(0, limit);

  return { data, hasMore };
}

export function listDueFeeds(): Feed[] {
  return db
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
}

export function getFeedById(id: string): Feed | null {
  return (
    db.select().from(feeds).where(eq(feeds.id, id)).get() ?? null
  );
}

export function createFeed(input: {
  title: string;
  url: string;
  description?: string | null;
}): Feed {
  const id = feedIdFromUrl(input.url);
  db.insert(feeds)
    .values({
      id,
      title: input.title,
      url: input.url,
      description: input.description ?? null,
    })
    .run();

  const created = getFeedById(id);
  if (!created) throw new Error("Failed to create feed");
  return created;
}

export function updateFeed(
  id: string,
  input: {
    title?: string;
    description?: string | null;
  },
): Feed | null {
  const existing = getFeedById(id);
  if (!existing) return null;

  const title = input.title ?? existing.title;
  const description =
    input.description !== undefined ? input.description : existing.description;

  db.update(feeds)
    .set({
      title,
      description,
      updated_at: sql`datetime('now')`,
    })
    .where(eq(feeds.id, id))
    .run();

  return getFeedById(id);
}

export function updateFeedFetchState(
  id: string,
  input: { fetch_interval_min: number; next_fetched_at: string },
): void {
  db.update(feeds)
    .set({
      fetch_interval_min: input.fetch_interval_min,
      next_fetched_at: input.next_fetched_at,
    })
    .where(eq(feeds.id, id))
    .run();
}

export function deleteFeed(id: string): boolean {
  const deleted = db
    .delete(feeds)
    .where(eq(feeds.id, id))
    .returning()
    .all();
  return deleted.length > 0;
}

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("UNIQUE constraint failed")
  );
}

export function feedIdFromUrl(url: string): string {
  return Bun.hash.xxHash32(url).toString(16).padStart(8, "0");
}