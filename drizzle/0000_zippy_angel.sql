CREATE TABLE `t_feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`fetch_interval_min` integer DEFAULT 15 NOT NULL,
	`next_fetched_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `t_feeds_url_unique` ON `t_feeds` (`url`);--> statement-breakpoint
CREATE INDEX `idx_feeds_updated_at` ON `t_feeds` (`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_feeds_next_fetched_at` ON `t_feeds` (`next_fetched_at`);--> statement-breakpoint
CREATE TABLE `t_items` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` text NOT NULL,
	`guid` text NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`description` text,
	`published_at` text NOT NULL,
	`is_read` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `t_feeds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_items_published_at` ON `t_items` (`published_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `t_items_feed_id_guid_unique` ON `t_items` (`feed_id`,`guid`);