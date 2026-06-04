import { Elysia } from "elysia";
import {
  createFeed,
  updateFeed,
  deleteFeed,
  getFeed,
  getFeeds,
  getAllFeeds,
  feedCursorSortTime,
  type FeedSort,
} from "../db/feeds";
import { encodeCursor } from "../db/utils";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../db/schema";
import { fetchFeedMetadata } from "../services/feeds/fetcher";
import { feedsToOpml } from "../services/feeds/opml";

const FEED_SORTS = new Set<FeedSort>([
  "updated_desc",
  "published_desc",
  "published_asc",
]);

function parseFeedSort(value?: string): FeedSort {
  if (value && FEED_SORTS.has(value as FeedSort)) {
    return value as FeedSort;
  }
  return "updated_desc";
}

function getFeedsHandler({
  query,
}: {
  query: {
    keyword?: string;
    cursor?: string;
    limit?: number;
    sort?: string;
  };
}) {
  try {
    const sort = parseFeedSort(query.sort);

    const adjustedLimit = Math.min(
      Math.max(query.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const selected = getFeeds({
      cursor: query.cursor,
      limit: adjustedLimit,
      keyword: query.keyword,
      sort,
    });

    const hasMore = selected.length > adjustedLimit;
    const returned = selected.slice(0, adjustedLimit);

    const lastFeed = returned.at(-1);
    const nextCursor =
      hasMore && lastFeed
        ? encodeCursor(feedCursorSortTime(lastFeed, sort), lastFeed.id)
        : null;

    return {
      code: 0,
      message: "ok",
      data: {
        feeds: returned,
        hasMore: hasMore,
        nextCursor: nextCursor,
      }
    };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get feeds";
    return { code: 500, message };
  }
}

async function getFeedMetaHandler({ body }: { body: any; }) {

  try {
    const data = await fetchFeedMetadata(body.url);
    return { code: 0, message: "ok", data: data };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse feed";
    return { code: 500, message: message };
  }
}

function getFeedHandler({ params }: { params: { id: string; }; }) {

  try {
    const feed = getFeed(params.id);
    return { code: 0, message: "ok", data: feed };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get feed";
    return { code: 500, message };
  }
}

function createFeedHandler({ body }: { body: any; }) {

  try {
    const created = createFeed(body);
    return { code: 0, message: "ok", data: created };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create feed";
    return { code: 500, message };
  }
}

function updateFeedHandler({ params, body }: { params: { id: string; }; body: any; }) {

  try {
    const feed = updateFeed(params.id, body);
    return { code: 0, message: "ok", data: feed };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update feed";
    return { code: 500, message };
  }
}

function deleteFeedHandler({ params }: { params: { id: string; }; }) {
  try {
    deleteFeed(params.id);
    return { code: 0, message: "ok" };

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete feed";
    return { code: 500, message };
  }
}

function exportOpmlHandler() {
  try {
    const opml = feedsToOpml(getAllFeeds());
    return new Response(opml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": 'attachment; filename="nanoflux.opml"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to export OPML";
    return new Response(message, { status: 500 });
  }
}

export const routes = new Elysia({ prefix: "/api/feeds" })
  .get("/", getFeedsHandler)
  .get("/export.opml", exportOpmlHandler)
  .post("/create", createFeedHandler)
  .get("/:id", getFeedHandler)
  .post("/:id", updateFeedHandler)
  .post("/:id/delete", deleteFeedHandler)
  .post("/meta", getFeedMetaHandler);