UPDATE `t_items` SET `is_deleted` = 1 WHERE `filter_passed` = 0;--> statement-breakpoint
UPDATE `t_items` SET `passed_reason` = NULL WHERE `filter_passed` = 1;--> statement-breakpoint
ALTER TABLE `t_items` RENAME COLUMN `passed_reason` TO `deleted_reason`;--> statement-breakpoint
ALTER TABLE `t_items` DROP COLUMN `filter_passed`;
