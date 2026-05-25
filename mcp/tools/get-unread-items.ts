import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getItems } from "../../db/items";

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
          .max(50)
          .optional()
          .describe("Max news entries to return (default 20, max 50)"),
      },
    },
    async ({ unit, count, limit }) => {
    
      try {

        const selected = getItems({ unit, count, limit, isRead: 0 });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ items: selected.slice(0, limit) }),
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
