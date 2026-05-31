import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const feeds = sqliteTable(
  "t_feeds",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description"),
    fetch_interval_min: integer("fetch_interval_min").notNull().default(15),
    next_fetched_at: text("next_fetched_at"),
    last_build_date: text("last_build_date"),
    last_guids: text("last_guids"),
    last_published_at: text("last_published_at"),
    created_at: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("idx_feeds_updated_at").on(table.updated_at),
    index("idx_feeds_next_fetched_at").on(table.next_fetched_at),
    index("idx_feeds_last_published_at").on(table.last_published_at),
  ],
);

export const items = sqliteTable(
  "t_items",
  {
    id: text("id").primaryKey(),
    feed_id: text("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    guid: text("guid").notNull(),
    title: text("title").notNull(),
    link: text("link").notNull(),
    content: text("content"),
    published_at: text("published_at").notNull(),
    is_read: integer("is_read").notNull().default(0),
    filter_passed: integer("filter_passed"),
    matched_keywords: text("matched_keywords"),
    pass_reason: text("pass_reason"),
    created_at: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    unique().on(table.feed_id, table.guid),
    index("idx_items_published_at").on(table.published_at),
  ],
);

export type Feed = InferSelectModel<typeof feeds>;
export type Item = InferSelectModel<typeof items>;

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;