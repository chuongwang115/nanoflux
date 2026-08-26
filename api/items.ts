import { Elysia } from "elysia";
import {
  deleteItemsBySource,
  getItemCover,
  getItems,
  markItemsRead,
  markItemRead,
} from "../db/items";
import { getFilterConfig, updateFilterConfig } from "../filter";
import { DEFAULT_LOCALE, parseLocale } from "../shared/locale";
import { buildItemsExport, type ExportLocale } from "../services/export/items-export";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../db/schema";
import { encodeCursor, parseItemId, parseTimeUnit } from "../db/utils";
import { httpGet } from "../services/http-fetcher";

const COVER_FETCH_TIMEOUT_MS = 15_000;
const MAX_COVER_BYTES = 10 * 1024 * 1024;

function coverError(status: number, message: string): Response {
  return new Response(message, { status, headers: { "Cache-Control": "no-store" } });
}

async function coverHandler({ params }: { params: { id: string } }): Promise<Response> {
  const id = parseItemId(params.id);
  if (id === null) return coverError(400, "Invalid item id");

  const cover = getItemCover(id);
  if (!cover) return coverError(404, "Cover not found");

  let url: URL;
  try {
    url = new URL(cover);
  } catch {
    return coverError(404, "Cover not found");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return coverError(404, "Cover not found");
  }

  try {
    // The URL is read only from our item store rather than a request parameter,
    // so this endpoint cannot be used as an arbitrary network proxy. Following
    // redirects is necessary for image CDNs that serve a canonical image URL.
    const response = await httpGet(url.href, {
      redirect: "follow",
      signal: AbortSignal.timeout(COVER_FETCH_TIMEOUT_MS),
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "NanoFlux cover proxy",
      },
    });
    if (!response.ok) return coverError(502, "Unable to fetch cover");

    const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    if (!contentType?.startsWith("image/")) {
      return coverError(415, "Cover response is not an image");
    }
    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_COVER_BYTES) {
      return coverError(413, "Cover is too large");
    }
    if (!response.body) return coverError(502, "Empty cover response");

    let receivedBytes = 0;
    const limitedBody = response.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        receivedBytes += chunk.byteLength;
        if (receivedBytes > MAX_COVER_BYTES) {
          controller.error(new Error("Cover is too large"));
          return;
        }
        controller.enqueue(chunk);
      },
    }));

    return new Response(limitedBody, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return coverError(502, "Unable to fetch cover");
  }
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
    is_read?: number;
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

    const isRead = parseIsRead(query?.is_read);

    const selected = getItems({
      cursor: query?.cursor,
      limit:adjustedLimit,
      since: query?.since,
      until: query?.until,
      unit: unit ? unit.toString() : undefined,
      count: query?.count,
      isRead,
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
  return parseLocale(typeof raw === "string" ? raw : undefined) ?? DEFAULT_LOCALE;
}

function exportItemsHandler({ query }: {
  query?: {
    since?: string;
    until?: string;
    tz_offset?: number;
    lang?: string;
  };
}) {
  try {
    const since = query?.since?.trim() || undefined;
    const until = query?.until?.trim() || undefined;

    const xlsx = buildItemsExport({
      since,
      until,
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
  };
}) {
  try {
    markItemsRead(body.until ?? "");
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
    const id = parseItemId(params.id);
    if (id === null) {
      return { code: 400, message: "Invalid item id" };
    }
    markItemRead(id);
    return { code: 0, message: "ok" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark item as read";
    return { code: 500, message };
  }
}

async function blockSourceHandler({ body }: { body: { source?: string } }) {
  try {
    const source = body.source?.trim().toLocaleLowerCase() ?? "";
    if (!source) {
      return { code: 400, message: "Source is required" };
    }

    const current = getFilterConfig();
    const sources = [...new Set([...current.sources, source])];
    const filter = await updateFilterConfig({ sources });
    const deleted = deleteItemsBySource(source);
    return { code: 0, message: "ok", data: { source, deleted, filter } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to block source";
    return { code: 500, message };
  }
}

export const routes = new Elysia({ prefix: "/api/items" })
  .get("/", getItemsHandler)
  .get("/export.xlsx", exportItemsHandler)
  .get("/:id/cover", coverHandler)
  .post("/read-all", markItemsReadHandler)
  .post("/block-source", blockSourceHandler)
  .post("/:id/read", markItemReadHandler);
