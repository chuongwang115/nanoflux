import { getItemsForExport } from "../../db/items";
import { DEFAULT_LOCALE, type Locale } from "../../shared/locale";
import { buildXlsx } from "./xlsx";

export type ExportLocale = Locale;

const HEADERS: Record<ExportLocale, string[]> = {
  "zh-Hans": ["发布时间", "标题", "内容", "原文链接"],
  "zh-Hant": ["發布時間", "標題", "內容", "原文連結"],
  en: ["Published at", "Title", "Content", "Link"],
};

/** Format a stored ISO timestamp as `YYYY-MM-DD HH:mm` in the caller's timezone. */
function formatPublishedAt(iso: string, tzOffsetMin: number): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  const local = new Date(ms - tzOffsetMin * 60_000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())} ` +
    `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`
  );
}

export function buildItemsExport(options: {
  since?: string;
  until?: string;
  tzOffsetMin?: number;
  locale?: ExportLocale;
}): Uint8Array<ArrayBuffer> {
  const rows = getItemsForExport({
    since: options.since,
    until: options.until,
  });

  const tzOffset = options.tzOffsetMin ?? 0;
  const headers = HEADERS[options.locale ?? DEFAULT_LOCALE];

  const dataRows = rows.map((row) => [
    formatPublishedAt(row.published_at, tzOffset),
    row.title ?? "",
    row.content ?? "",
    row.link ?? "",
  ]);

  return buildXlsx(headers, dataRows);
}
