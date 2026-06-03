UPDATE `t_items`
SET `passed_filters` = json_array(
  json_object(
    'id', 'legacy',
    'keywords', `matched_keywords`,
    'reason', `pass_reason`
  )
)
WHERE `filter_passed` = 1 AND `passed_filters` IS NULL;--> statement-breakpoint
ALTER TABLE `t_items` DROP COLUMN `filter_passed`;--> statement-breakpoint
ALTER TABLE `t_items` DROP COLUMN `matched_keywords`;--> statement-breakpoint
ALTER TABLE `t_items` DROP COLUMN `pass_reason`;
