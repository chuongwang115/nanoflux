PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `t_items_new` (
	`id` integer PRIMARY KEY NOT NULL,
	`feed_id` integer NOT NULL,
	`guid` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`link` text NOT NULL,
	`source` text DEFAULT '' NOT NULL,
	`cover` text,
	`published_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`status` text DEFAULT 'passed' NOT NULL,
	`status_reason` text,
	`is_ingested` integer DEFAULT 0 NOT NULL,
	`is_read` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`feed_id`) REFERENCES `t_feeds`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
INSERT INTO `t_items_new` (`id`, `feed_id`, `guid`, `title`, `content`, `link`, `source`, `cover`, `published_at`, `created_at`, `status`, `status_reason`, `is_ingested`, `is_read`)
SELECT `id`, `feed_id`, `guid`, `title`, `content`, `link`, `source`, `cover`, `published_at`, `created_at`, CASE WHEN `is_deleted` = 1 THEN 'deleted' ELSE 'passed' END, `deleted_reason`, `is_ingested`, `is_read`
FROM `t_items`;--> statement-breakpoint
DROP TABLE `t_items`;--> statement-breakpoint
ALTER TABLE `t_items_new` RENAME TO `t_items`;--> statement-breakpoint
CREATE UNIQUE INDEX `t_items_guid_unique` ON `t_items` (`guid`);--> statement-breakpoint
CREATE INDEX `idx_items_published_at` ON `t_items` (`published_at`);--> statement-breakpoint
PRAGMA foreign_keys=ON;
