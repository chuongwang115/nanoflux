ALTER TABLE `t_items` RENAME COLUMN `passed_filters` TO `filter_passed`;--> statement-breakpoint
UPDATE `t_items`
SET `filter_passed` = COALESCE(
  json_extract(`filter_passed`, '$[0].reason'),
  ''
)
WHERE `filter_passed` IS NOT NULL
  AND json_valid(`filter_passed`)
  AND json_type(`filter_passed`) = 'array';
