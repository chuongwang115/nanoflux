import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFeeds } from "../../db/feeds";

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
          .max(50)
          .optional()
          .describe("Max feeds to return (default 20, max 50)"),
      },
    },
    async ({ limit, keyword }) => {

      try {

        const selected = getFeeds({ limit, keyword });

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
