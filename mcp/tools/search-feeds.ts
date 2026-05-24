import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchFeeds } from "../../db/feeds";

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
    async ({ keyword, page, limit }) => {
      const resolvedPage = page ?? 1;
      const { data: feeds, hasMore } = searchFeeds({
        keyword,
        page: resolvedPage,
        limit,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                keyword,
                currentPage: resolvedPage,
                nextPage: hasMore ? resolvedPage + 1 : undefined,
                total: feeds.length,
                hasMore,
                feeds: feeds.map((feed) => ({
                  id: feed.id,
                  title: feed.title,
                  url: feed.url,
                  description: feed.description,
                  created_at: feed.created_at,
                  updated_at: feed.updated_at,
                })),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
