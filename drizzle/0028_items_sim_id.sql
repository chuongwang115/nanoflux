ALTER TABLE `t_items` ADD `sim_id` integer;--> statement-breakpoint
CREATE INDEX `idx_items_sim_id` ON `t_items` (`sim_id`);
