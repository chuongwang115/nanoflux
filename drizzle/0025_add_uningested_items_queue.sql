CREATE TABLE `t_uningested_items` (
	`item_id` integer PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`item_id`) REFERENCES `t_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `t_uningested_items` (`item_id`, `created_at`)
SELECT `id`, `created_at`
FROM `t_items`
WHERE `is_ingested` = 0 AND `status` = 'passed';
--> statement-breakpoint
ALTER TABLE `t_items` DROP COLUMN `is_ingested`;
--> statement-breakpoint
CREATE INDEX `idx_uningested_items_created_at` ON `t_uningested_items` (`created_at`);
