import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getItems } from "../../db/items";
import { parseTimeUnit, encodeCursor } from "../../db/utils";

export function registerGetItems(server: McpServer): void {
  server.registerTool(
    "get_news",
    {
      description:
        "Fetch news in a time range. Use since/until (ISO 8601 bounds) or unit/count (relative window: minutes, hours, or days back from now). When hasMore is true, call again with cursor and the same time range (after a relative query, use resolved_since/resolved_until as since/until).",
      inputSchema: {
        since: z
          .string()
          .optional()
          .describe("Start time (ISO 8601); use with until"),
        until: z
          .string()
          .optional()
          .describe("End time (ISO 8601); use with since"),
        unit: z.string()
          .optional()
          .describe("Time unit; use with count for a relative range from now"),
        count: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe(
            "Number of units (e.g. unit=hour, count=2 for the last 2 hours)",
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
    async ({ since, until, unit, count, limit }) => {

      try {

        const selected = getItems({ since, until, unit, count, limit });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify( { items: selected.slice(0, limit) }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get items";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: message }),
            },
          ],
        };
      }
    }
  );
}

