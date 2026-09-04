import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { takeUningestedItems } from "../../db/items";
import { MAX_LIMIT } from "../../db/schema";

export function registerGetUningestedNews(server: McpServer): void {
  server.registerTool(
    "get_uningested_news",
    {
      description:
        "Fetch uningested news from the last count days. Returned news are marked as ingested. When hasMore is true, call again with the same count to fetch the next batch until hasMore is false.",
      inputSchema: {
        count: z.number().int().min(1).describe("Number of days before now (e.g. 2 for the last 2 days)"),
      },
    },

    async ({ count }) => {

      try {

        const { items: returned, hasMore } = takeUningestedItems({
          unit: "day",
          count,
          limit: MAX_LIMIT,
        });

        const message = hasMore
          ? [
              "More uningested news remain.",
              "Call get_uningested_news again with the same parameters:",
              `count=${count}`,
            ].join(" ")
          : "No more uningested news in this window.";

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
          error instanceof Error ? error.message : "Failed to get uningested news";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
