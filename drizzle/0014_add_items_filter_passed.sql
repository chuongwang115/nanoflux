ALTER TABLE `t_items` ADD `filter_passed` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `t_items` SET `filter_passed` = 1 WHERE `passed_reason` IS NOT NULL;
