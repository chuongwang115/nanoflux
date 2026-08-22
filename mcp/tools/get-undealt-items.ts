import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getItems, markItemDealt } from "../../db/items";
import { DEFAULT_LIMIT, MAX_LIMIT } from "../../db/schema";

export function registerGetUndealtItems(server: McpServer): void {
  server.registerTool(
    "get_undealt_news",
    {
      description:
        "Fetch undealt news within a relative time window before now. Returned news are marked as dealt. When hasMore is true, call again with the same unit/count (and limit) to fetch the next batch until hasMore is false.",
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

        const selected = getItems({
          unit,
          count,
          limit: adjustedLimit,
          isDealt: 0,
        });

        const hasMore = selected.length > adjustedLimit;
        const returned = selected.slice(0, adjustedLimit);

        for (const item of returned) {
          markItemDealt(item.id);
        }

        const message = hasMore
          ? [
              "More undealt news remain.",
              "Call get_undealt_news again with the same parameters:",
              `unit=${unit}`,
              `count=${count}`,
              `limit=${adjustedLimit}`,
            ].join(" ")
          : "No more undealt news in this window.";

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
                message,
              }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get undealt news";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
