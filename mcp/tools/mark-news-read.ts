import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { markItemsRead } from "../../db/items";
import { messages } from "../../client/src/lib/i18n/messages";

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

      try {

        if (Number.isNaN(Date.parse(until))) {
          throw new Error(`Invalid until timestamp: ${until}`);
        }

        markItemsRead(until);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ messages: 'news marked as read' }, null, 2),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to mark news as read";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
