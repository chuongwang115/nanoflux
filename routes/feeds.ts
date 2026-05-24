import { Elysia, t } from "elysia";
import {
  createFeed,
  deleteFeed,
  getFeedById,
  isUniqueConstraintError,
  listFeeds,
  updateFeed,
} from "../db/feeds";
import { fetchFeedMetadata } from "../services/feed-fetcher";

const feedBody = t.Object({
  title: t.String({ minLength: 1 }),
  url: t.String({ format: "uri", minLength: 1 }),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});

const feedUpdateBody = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  url: t.Optional(t.String({ format: "uri", minLength: 1 })),
  description: t.Optional(t.Union([t.String(), t.Null()])),
});

export const routes = new Elysia({ prefix: "/api/feeds" })
  .get("/", () => ({ data: listFeeds() }))
  .get(
    "/meta",
    async ({ query, set }) => {
      try {
        const data = await fetchFeedMetadata(query.url);
        return { data };
      } catch (error) {
        set.status = 400;
        const message =
          error instanceof Error ? error.message : "Failed to parse feed";
        return { error: message };
      }
    },
    {
      query: t.Object({
        url: t.String({ format: "uri", minLength: 1 }),
      }),
    },
  )
  .get(
    "/:id",
    ({ params, set }) => {
      const feed = getFeedById(params.id);
      if (!feed) {
        set.status = 404;
        return { error: "Feed not found" };
      }
      return { data: feed };
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    },
  )
  .post(
    "/",
    ({ body, set }) => {
      try {
        const feed = createFeed(body);
        set.status = 201;
        return { data: feed };
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          set.status = 409;
          return { error: "Feed URL already exists" };
        }
        throw error;
      }
    },
    { body: feedBody },
  )
  .put(
    "/:id",
    ({ params, body, set }) => {
      try {
        const feed = updateFeed(params.id, body);
        if (!feed) {
          set.status = 404;
          return { error: "Feed not found" };
        }
        return { data: feed };
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          set.status = 409;
          return { error: "Feed URL already exists" };
        }
        throw error;
      }
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
      body: feedUpdateBody,
    },
  )
  .delete(
    "/:id",
    ({ params, set }) => {
      const deleted = deleteFeed(params.id);
      if (!deleted) {
        set.status = 404;
        return { error: "Feed not found" };
      }
      return { success: true };
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    },
  );
