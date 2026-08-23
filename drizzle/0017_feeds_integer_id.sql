PRAGMA foreign_keys=OFF;--> statement-breakpoint
ALTER TABLE `t_feeds` RENAME COLUMN `last_pub_date` TO `last_build_date`;--> statement-breakpoint
CREATE TABLE `t_feeds_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`fetch_interval_min` integer DEFAULT 15 NOT NULL,
	`next_fetched_at` text,
	`last_build_date` text,
	`last_guids` text,
	`last_published_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);--> statement-breakpoint
INSERT INTO `t_feeds_new` (`title`, `url`, `description`, `fetch_interval_min`, `next_fetched_at`, `last_build_date`, `last_guids`, `last_published_at`, `created_at`, `updated_at`)
SELECT `title`, `url`, `description`, `fetch_interval_min`, `next_fetched_at`, `last_build_date`, `last_guids`, `last_published_at`, `created_at`, `updated_at`
FROM `t_feeds`
ORDER BY `created_at` ASC, `id` ASC;--> statement-breakpoint
CREATE TABLE `t_items_new` (
	`id` text PRIMARY KEY NOT NULL,
	`feed_id` integer NOT NULL,
	`guid` text NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`content` text,
	`published_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`is_deleted` integer DEFAULT 0 NOT NULL,
	`deleted_reason` text,
	`is_read` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `t_feeds_new`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
INSERT INTO `t_items_new` (`id`, `feed_id`, `guid`, `title`, `link`, `content`, `published_at`, `created_at`, `is_deleted`, `deleted_reason`, `is_read`)
SELECT `i`.`id`, `n`.`id`, `i`.`guid`, `i`.`title`, `i`.`link`, `i`.`content`, `i`.`published_at`, `i`.`created_at`, `i`.`is_deleted`, `i`.`deleted_reason`, `i`.`is_read`
FROM `t_items` AS `i`
INNER JOIN `t_feeds` AS `o` ON `o`.`id` = `i`.`feed_id`
INNER JOIN `t_feeds_new` AS `n` ON `n`.`url` = `o`.`url`;--> statement-breakpoint
DROP TABLE `t_items`;--> statement-breakpoint
DROP TABLE `t_feeds`;--> statement-breakpoint
ALTER TABLE `t_feeds_new` RENAME TO `t_feeds`;--> statement-breakpoint
ALTER TABLE `t_items_new` RENAME TO `t_items`;--> statement-breakpoint
CREATE UNIQUE INDEX `t_feeds_url_unique` ON `t_feeds` (`url`);--> statement-breakpoint
CREATE INDEX `idx_feeds_updated_at` ON `t_feeds` (`updated_at`);--> statement-breakpoint
CREATE INDEX `idx_feeds_next_fetched_at` ON `t_feeds` (`next_fetched_at`);--> statement-breakpoint
CREATE INDEX `idx_feeds_last_published_at` ON `t_feeds` (`last_published_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `t_items_guid_unique` ON `t_items` (`guid`);--> statement-breakpoint
CREATE INDEX `idx_items_published_at` ON `t_items` (`published_at`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
