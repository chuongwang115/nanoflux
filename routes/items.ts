import { Elysia } from "elysia";
import {
  getItems,
  markItemsRead,
  markItemRead,
} from "../db/items";
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

    const selected = getItems({
      cursor: query?.cursor,
      limit:adjustedLimit,
      since: query?.since,
      until: query?.until,
      unit: unit ? unit.toString() : undefined,
      count: query?.count,
      filterPassed,
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

function markItemsReadHandler({ body }: {
  body: any;
}) {
  try {
    markItemsRead(body.until);
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

export const routes = new Elysia({ prefix: "/api/items" })
  .get("/", getItemsHandler)
  .post("/read-all", markItemsReadHandler)
  .post("/:id/read", markItemReadHandler);
