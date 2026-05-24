import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchItems } from "../../db/items";

export function registerSearchNews(server: McpServer): void {
  server.registerTool(
    "search_news",
    {
      description:
        "Search news by keyword in title or summary within a published_at range (inclusive since/until). When hasMore is true, call again with cursor and the same keyword/since/until.",
      inputSchema: {
        keyword: z.string().describe("Search keyword"),
        since: z
          .string()
          .describe("Start time (ISO 8601); published_at >= since"),
        until: z
          .string()
          .describe("End time (ISO 8601); published_at <= until"),
        cursor: z
          .string()
          .optional()
          .describe(
            "Pagination cursor from a previous response (nextCursor); keep the same keyword and time range",
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Max news entries to return (default 20, max 50)"),
      },
    },
    async ({ keyword, since, until, cursor, limit }) => {
      if (Number.isNaN(Date.parse(since))) {
        throw new Error(`Invalid since timestamp: ${since}`);
      }
      if (Number.isNaN(Date.parse(until))) {
        throw new Error(`Invalid until timestamp: ${until}`);
      }
      if (since > until) {
        throw new Error("since must be before or equal to until");
      }

      const { data: items, hasMore, nextCursor } = searchItems({
        keyword,
        since,
        until,
        cursor,
        limit,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                keyword,
                since,
                until,
                total: items.length,
                hasMore,
                nextCursor,
                items: items.map((item) => ({
                  id: item.id,
                  title: item.title,
                  link: item.link,
                  description: item.description,
                  published_at: item.published_at,
                  feed_title: item.feed_title,
                  is_read: item.is_read,
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
