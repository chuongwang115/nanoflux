import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFeeds } from "../../db/feeds";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../../db/schema";

export function registerSearchFeeds(server: McpServer): void {
  server.registerTool(
    "search_feeds",
    {
      description:
        "Search feeds by keyword in title.",
      inputSchema: {
        keyword: z.string().describe("Search keyword"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe("Max feeds to return (default 20, max 50)"),
      },
    },
    async ({ limit, keyword }) => {

      try {


        const adjustedLimit = Math.min(
          Math.max(limit ?? DEFAULT_LIMIT, 1),
          MAX_LIMIT,
        );

        const selected = getFeeds({ limit: adjustedLimit, keyword });

        const hasMore = selected.length > adjustedLimit;
        const returned = selected.slice(0, adjustedLimit);

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
                  hasMore: hasMore,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to search feeds";
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
