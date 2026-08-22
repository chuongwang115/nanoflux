PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `t_items_new` (
	`id` integer PRIMARY KEY NOT NULL,
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
	FOREIGN KEY (`feed_id`) REFERENCES `t_feeds`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
INSERT INTO `t_items_new` (`id`, `feed_id`, `guid`, `title`, `link`, `content`, `published_at`, `created_at`, `is_deleted`, `deleted_reason`, `is_read`)
SELECT
	(CAST(strftime('%Y%m%d%H%M%S', `created_at`) AS INTEGER) * 100)
	+ (ROW_NUMBER() OVER (
		PARTITION BY strftime('%Y%m%d%H%M%S', `created_at`)
		ORDER BY `rowid` ASC
	) - 1),
	`feed_id`,
	`guid`,
	`title`,
	`link`,
	`content`,
	`published_at`,
	`created_at`,
	`is_deleted`,
	`deleted_reason`,
	`is_read`
FROM `t_items`;--> statement-breakpoint
DROP TABLE `t_items`;--> statement-breakpoint
ALTER TABLE `t_items_new` RENAME TO `t_items`;--> statement-breakpoint
CREATE UNIQUE INDEX `t_items_guid_unique` ON `t_items` (`guid`);--> statement-breakpoint
CREATE INDEX `idx_items_published_at` ON `t_items` (`published_at`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
