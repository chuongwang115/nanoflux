import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getItems, markItemRead } from "../../db/items";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../../db/schema";

export function registerGetUnreadItems(server: McpServer): void {
  server.registerTool(
    "get_unread_news",
    {
      description:
        "Fetch unread news within a relative time window before now.).",
      inputSchema: {
        unit: z.string().describe("Time unit; use with count for a relative range from now"),
        count: z.number().int().min(1).describe("Number of units (e.g. unit=hour, count=2 for the last 2 hours)"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe("Max news entries to return (default 20, max 50)"),
      },
    },
    async ({ unit, count, limit }) => {
    
      try {


        const adjustedLimit = Math.min(
          Math.max(limit ?? DEFAULT_LIMIT, 1),
          MAX_LIMIT,
        );

        const selected = getItems({ unit, count, limit: adjustedLimit, isRead: 0 });

        const hasMore = selected.length > adjustedLimit;
        const returned = selected.slice(0, adjustedLimit);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ 
                items: returned.map((item) => ({
                  id: item.id,
                  title: item.title,
                  link: item.link,
                  description: item.description ?? null,
                  published_at: item.published_at,
                  feed_title: item.feed_title,
                })),
                hasMore: hasMore,
              }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get unread news";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
