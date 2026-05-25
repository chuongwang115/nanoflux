import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFeeds } from "../../db/feeds";

export function registerSearchFeeds(server: McpServer): void {
  server.registerTool(
    "search_feeds",
    {
      description:
        "Search feeds by keyword in title, URL, or description. When hasMore is true, call again with page incremented and the same keyword.",
      inputSchema: {
        keyword: z.string().describe("Search keyword"),
        page: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe("Page number, 1-based (default 1)"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Max feeds to return (default 20, max 50)"),
      },
    },
    async ({ page, limit, keyword }) => {

      try {

        const selected = getFeeds({
          page,
          limit,
          keyword,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  feeds: selected.map((feed) => ({
                    id: feed.id,
                    title: feed.title,
                    url: feed.url,
                    description: feed.description ?? null
                  })) ?? [],
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
