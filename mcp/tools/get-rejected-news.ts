import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getItems } from "../../db/items";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../../db/schema";
import { encodeCursor } from "../../db/utils";

export function registerGetRejectedNews(server: McpServer): void {
  server.registerTool(
    "get_rejected_news",
    {
      description:
        "Fetch rejected news from the last count days without changing their ingestion status. Use nextCursor from the response as cursor to load the next page.",
      inputSchema: {
        count: z.number().int().min(1).describe("Number of days before now (e.g. 2 for the last 2 days)"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe("Max news entries to return (default 20, max 50)"),
        cursor: z
          .string()
          .min(1)
          .optional()
          .describe("Cursor returned as nextCursor by a previous call"),
      },
    },

    async ({ count, limit, cursor }) => {
      try {
        const adjustedLimit = Math.min(
          Math.max(limit ?? DEFAULT_LIMIT, 1),
          MAX_LIMIT,
        );

        const selected = getItems({
          unit: "day",
          count,
          limit: adjustedLimit,
          status: "rejected",
          cursor,
        });

        const hasMore = selected.length > adjustedLimit;
        const returned = selected.slice(0, adjustedLimit);
        const lastItem = returned.at(-1);
        const nextCursor = hasMore && lastItem
          ? encodeCursor(lastItem.published_at, lastItem.id)
          : null;

        const message = hasMore
          ? "More rejected news remain. Call again with nextCursor to load the next page."
          : "No more rejected news in this window.";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                items: returned.map((item) => ({
                  id: item.id,
                  title: item.title,
                  link: item.link,
                  content: item.content ?? null,
                  published_at: item.published_at,
                  feed_title: item.feed_title,
                })),
                hasMore,
                nextCursor,
                message,
              }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get rejected news";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
