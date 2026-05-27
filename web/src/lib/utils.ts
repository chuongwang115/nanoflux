import { localeState, t, tf } from "./locale.svelte";

export function formatTime(iso: string | null, nowMs: number = Date.now()): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const now = new Date(nowMs);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("time.justNow");
  if (mins < 60) return tf("time.minutesAgo", { n: mins });

  const hours = Math.floor(mins / 60);
  if (hours < 24) return tf("time.hoursAgo", { n: hours });

  const days = Math.floor(hours / 24);
  if (days < 7) return tf("time.daysAgo", { n: days });

  const tag = localeState.locale === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleDateString(tag, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
