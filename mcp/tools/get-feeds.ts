import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFeeds } from "../../db/feeds";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../../db/schema";
import { encodeCursor } from "../../db/utils";

export function registerGetFeeds(server: McpServer): void {
  server.registerTool(
    "get-feeds",
    {
      description:
        "List feeds, optionally filtering by a keyword in the title. Use nextCursor from the response as cursor to load the next page.",
      inputSchema: {
        keyword: z
          .string()
          .optional()
          .describe("Optional keyword to filter feed titles"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe("Max feeds to return (default 20, max 50)"),
        cursor: z
          .string()
          .min(1)
          .optional()
          .describe("Cursor returned as nextCursor by a previous call"),
      },
    },
    async ({ limit, keyword, cursor }) => {

      try {

        const adjustedLimit = Math.min(
          Math.max(limit ?? DEFAULT_LIMIT, 1),
          MAX_LIMIT,
        );

        const selected = getFeeds({
          cursor,
          limit: adjustedLimit,
          keyword,
        });

        const hasMore = selected.length > adjustedLimit;
        const returned = selected.slice(0, adjustedLimit);
        const lastFeed = returned.at(-1);
        const nextCursor = hasMore && lastFeed
          ? encodeCursor(lastFeed.updated_at, lastFeed.id)
          : null;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  feeds: returned.map((feed) => ({
                    id: feed.id,
                    title: feed.title,
                    url: feed.url,
                    description: feed.description ?? null
                  })) ?? [],
                  hasMore,
                  nextCursor,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get feeds";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: message }),
            },
          ],
        };
      }
    },
  );
}
