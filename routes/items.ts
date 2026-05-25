import { Elysia } from "elysia";
import { getItems, markItemsRead, markItemRead } from "../db/items";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../db/items";
import { encodeCursor } from "../db/utils";

function getItemsHandler({ query }: {
  query?: {
    cursor?: string;
    limit?: number;
  }
}) {

  try {

    const limit = Math.min(
      Math.max(query?.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const items = getItems({ cursor: query?.cursor, limit: limit });

    const hasMore = items.length > limit;
    const lastItem = items.at(-1);
    const nextCursor =
      hasMore && lastItem ? encodeCursor(lastItem.published_at, lastItem.id) : null;
  
    return { 
      code: 0, 
      message: "ok", 
      data: {
        items: items.slice(0, limit),
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
