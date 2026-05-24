import { fetchDueFeeds } from "./feed-fetcher";

const TICK_CRON = "* * * * *";

let fetchCronJob: Bun.CronJob | null = null;

export async function startFetchScheduler() {
  await fetchDueFeeds("startup");

  fetchCronJob = Bun.cron(TICK_CRON, async () => {
    try {
      await fetchDueFeeds("cron");
    } catch (error) {
      console.error("[fetch:cron]", error);
    }
  });

  console.log(
    `Fetch scheduler: Bun.cron (cron ${TICK_CRON} UTC, per-feed 5–30 min)`,
  );
}

export async function stopFetchScheduler() {
  if (!fetchCronJob) return;
  fetchCronJob.stop();
  fetchCronJob = null;
}
