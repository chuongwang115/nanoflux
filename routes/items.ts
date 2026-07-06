import { Elysia } from "elysia";
import {
  getItems,
  markItemsRead,
  markItemRead,
} from "../db/items";
import { buildItemsExport, type ExportLocale } from "../services/export/items-export";
import {
  acceptItemForFilter,
  rejectItemForFilter,
} from "../services/items/filter-verdict";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../db/schema";
import { encodeCursor, parseTimeUnit } from "../db/utils";

function parseFilterPassed(raw: unknown): 0 | 1 | undefined {
  if (raw === 0 || raw === "0") return 0;
  if (raw === 1 || raw === "1") return 1;
  return undefined;
}

function parseIsRead(raw: unknown): 0 | 1 | undefined {
  if (raw === 0 || raw === "0") return 0;
  if (raw === 1 || raw === "1") return 1;
  return undefined;
}

function getItemsHandler({ query }: {
  query?: {
    cursor?: string;
    limit?: number;
    since?: string;
    until?: string;
    unit?: string;
    count?: number;
    filter_passed?: number;
    is_read?: number;
    passed_filter_id?: string;
  }
}) {

  try {

    const adjustedLimit = Math.min(
      Math.max(query?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const unit = query?.unit ? parseTimeUnit(query.unit) : undefined;
    if (query?.unit && !unit) {
      return { code: 400, message: `Invalid time unit: ${query.unit}` };
    }

    const filterPassed = parseFilterPassed(query?.filter_passed);
    const isRead = parseIsRead(query?.is_read);
    const passedFilterId = query?.passed_filter_id?.trim() || undefined;

    const selected = getItems({
      cursor: query?.cursor,
      limit:adjustedLimit,
      since: query?.since,
      until: query?.until,
      unit: unit ? unit.toString() : undefined,
      count: query?.count,
      filterPassed,
      isRead,
      passedFilterId,
    });

    const hasMore = selected.length > adjustedLimit;
    const returned = selected.slice(0, adjustedLimit);

    const lastItem = returned.at(-1);
    const nextCursor =
      hasMore && lastItem ? encodeCursor(lastItem.published_at, lastItem.id) : null;
  
    return { 
      code: 0, 
      message: "ok", 
      data: {
        items: returned,
        nextCursor: nextCursor,
        hasMore: hasMore,
      } 
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list items";
    return { code: 500, message };
  }
}

function parseTzOffset(raw: unknown): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function parseExportLocale(raw: unknown): ExportLocale {
  return raw === "en" ? "en" : "zh";
}

function exportItemsHandler({ query }: {
  query?: {
    since?: string;
    until?: string;
    filter_passed?: number;
    passed_filter_id?: string;
    tz_offset?: number;
    lang?: string;
  };
}) {
  try {
    const filterPassed = parseFilterPassed(query?.filter_passed);
    const passedFilterId = query?.passed_filter_id?.trim() || undefined;
    const since = query?.since?.trim() || undefined;
    const until = query?.until?.trim() || undefined;

    const xlsx = buildItemsExport({
      since,
      until,
      filterPassed,
      passedFilterId,
      tzOffsetMin: parseTzOffset(query?.tz_offset),
      locale: parseExportLocale(query?.lang),
    });

    return new Response(xlsx, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="nanoflux-export.xlsx"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to export items";
    return new Response(message, { status: 500 });
  }
}

function markItemsReadHandler({ body }: {
  body: {
    until?: string;
    filter_passed?: number;
    passed_filter_id?: string;
  };
}) {
  try {
    const filterPassed = parseFilterPassed(body.filter_passed);
    const passedFilterId = body.passed_filter_id?.trim() || undefined;
    markItemsRead(body.until ?? "", { filterPassed, passedFilterId });
    return { code: 0, message: "ok" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark items as read";
    return { code: 500, message };
  }
}

function markItemReadHandler({ params }: {
  params: {
    id: string;
  };
}) {
  try {
    markItemRead(params.id);
    return { code: 0, message: "ok" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark item as read";
    return { code: 500, message };
  }
}

async function setItemFilterVerdictHandler({
  params,
  body,
}: {
  params: { id: string };
  body: { filter_id?: string; verdict?: string };
}) {
  try {
    const filterId = body.filter_id?.trim();
    if (!filterId) {
      return { code: 400, message: "Missing filter_id" };
    }
    if (body.verdict !== "accept" && body.verdict !== "reject") {
      return { code: 400, message: "Invalid verdict" };
    }
    if (body.verdict === "accept") {
      const data = await acceptItemForFilter(params.id, filterId);
      return { code: 0, message: "ok", data };
    }
    const data = await rejectItemForFilter(params.id, filterId);
    return { code: 0, message: "ok", data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to set filter verdict";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/items" })
  .get("/", getItemsHandler)
  .get("/export.xlsx", exportItemsHandler)
  .post("/read-all", markItemsReadHandler)
  .post("/:id/read", markItemReadHandler)
  .post("/:id/filter-verdict", setItemFilterVerdictHandler);
