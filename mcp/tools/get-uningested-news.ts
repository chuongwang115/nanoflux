import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getMcpItems } from "../../db/items";
import { MAX_LIMIT } from "../../db/schema";

export function registerGetUningestedNews(server: McpServer): void {
  server.registerTool(
    "get_uningested_news",
    {
      description:
        "Fetch passed news from the last count days in ascending item_id order. When hasMore is true, call again with nextcursor to fetch the next batch until hasMore is false.",
      inputSchema: {
        count: z.number().int().min(1).describe("Number of days before now (e.g. 2 for the last 2 days)"),
        cursor: z
          .number()
          .int()
          .positive()
          .safe()
          .optional()
          .describe("The item_id returned as nextcursor by a previous call"),
      },
    },

    async ({ count, cursor }) => {

      try {

        const { items: returned, hasMore } = getMcpItems({
          unit: "day",
          count,
          limit: MAX_LIMIT,
          cursor,
        });
        const nextcursor = hasMore ? returned.at(-1)?.id ?? null : null;

        const message = hasMore
          ? [
              "More news remain.",
              "Call get_uningested_news again with the same parameters and:",
              `cursor=${nextcursor}`,
            ].join(" ")
          : "No more news in this window.";

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
                nextcursor,
                message,
              }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get news";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
