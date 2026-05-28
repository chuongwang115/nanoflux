ALTER TABLE `t_feeds` ADD `last_published_at` text;--> statement-breakpoint
CREATE INDEX `idx_feeds_last_published_at` ON `t_feeds` (`last_published_at`);