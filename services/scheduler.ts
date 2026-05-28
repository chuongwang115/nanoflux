import { clearItems } from "../db/items";
import { fetchDueFeeds } from "./feed-fetcher";

const TICK_CRON = "* * * * *";
const CLEANUP_CRON = "0 1 * * *";

let fetchCronJob: Bun.CronJob | null = null;
let cleanupCronJob: Bun.CronJob | null = null;

export async function startScheduler() {

  // 启动时立即执行一次
  await fetchDueFeeds("startup");

  // 每分钟执行一次
  fetchCronJob = Bun.cron(TICK_CRON, async () => {
    try {
      await fetchDueFeeds("cron");
    } catch (error) {
      console.error("[fetch:cron]", error);
    }
  });

  // 每天凌晨1点执行一次
  cleanupCronJob = Bun.cron(CLEANUP_CRON, async () => {
    try {
      clearItems();
      console.log("[cleanup:cron] Removed items older than 90 days");
    } catch (error) {
      console.error("[cleanup:cron]", error);
    }
  });

  console.log(
    `Fetch feeds scheduler: Bun.cron (cron ${TICK_CRON} UTC, per-feed 5–30 min)`,
  );
  console.log(
    `Cleanup items scheduler: Bun.cron (cron ${CLEANUP_CRON} UTC, items older than 90 days)`,
  );
}

export async function stopScheduler() {
  if (fetchCronJob) {
    fetchCronJob.stop();
    fetchCronJob = null;
  }
  if (cleanupCronJob) {
    cleanupCronJob.stop();
    cleanupCronJob = null;
  }
}
