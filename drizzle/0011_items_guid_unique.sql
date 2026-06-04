DELETE FROM `t_items`
WHERE `rowid` NOT IN (
  SELECT MIN(`rowid`)
  FROM `t_items`
  GROUP BY `guid`
);--> statement-breakpoint
DROP INDEX `t_items_feed_id_guid_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `t_items_guid_unique` ON `t_items` (`guid`);
