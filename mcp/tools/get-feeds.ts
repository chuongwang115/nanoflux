import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFeeds } from "../../db/feeds";
import { MAX_LIMIT } from "../../db/schema";
import { encodeCursor } from "../../db/utils";

export function registerGetFeeds(server: McpServer): void {
  server.registerTool(
    "get_feeds",
    {
      description:
        "List feeds, optionally filtering by a keyword in the title. Use nextCursor from the response as cursor to load the next page.",
      inputSchema: {
        keyword: z
          .string()
          .optional()
          .describe("Optional keyword to filter feed titles"),
        cursor: z
          .string()
          .min(1)
          .optional()
          .describe("Cursor returned as nextCursor by a previous call"),
      },
    },
    async ({ keyword, cursor }) => {

      try {

        const selected = getFeeds({
          cursor,
          limit: MAX_LIMIT,
          keyword,
        });

        const hasMore = selected.length > MAX_LIMIT;
        const returned = selected.slice(0, MAX_LIMIT);
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
