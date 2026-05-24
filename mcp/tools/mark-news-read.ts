import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { markAllItemsRead } from "../../db/items";

export function registerMarkNewsRead(server: McpServer): void {
  server.registerTool(
    "mark_news_read",
    {
      description:
        "Mark unread news with published_at <= until as read",
      inputSchema: {
        until: z
          .string()
          .describe(
            "Cutoff time (ISO 8601); unread news at or before this time are marked read",
          ),
      },
    },
    async ({ until }) => {
      if (Number.isNaN(Date.parse(until))) {
        throw new Error(`Invalid until timestamp: ${until}`);
      }

      const marked_count = markAllItemsRead(until);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ until, marked_count }, null, 2),
          },
        ],
      };
    },
  );
}
