import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  listUnreadItems,
  parseTimeUnit,
  resolveTimeRange,
} from "../../db/items";
import { timeUnitSchema } from "../schema";

export function registerGetUnreadNews(server: McpServer): void {
  server.registerTool(
    "get_unread_news",
    {
      description:
        "Fetch unread news within a relative time window before now. When hasMore is true, call again with cursor and the same unit/count (or use resolved_since/resolved_until with get_news).",
      inputSchema: {
        unit: timeUnitSchema,
        count: z
          .number()
          .int()
          .min(1)
          .describe(
            "Number of units (e.g. unit=hour, count=2 for the last 2 hours)",
          ),
        cursor: z
          .string()
          .optional()
          .describe(
            "Pagination cursor from a previous response (nextCursor); keep the same unit and count",
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
    async ({ unit, count, cursor, limit }) => {
      const parsedUnit = parseTimeUnit(unit);
      if (!parsedUnit) {
        throw new Error(`Invalid time unit: ${unit}`);
      }

      const range = resolveTimeRange({ unit: parsedUnit, count });
      const { data: items, hasMore, nextCursor } = listUnreadItems({
        unit: parsedUnit,
        count,
        cursor,
        limit,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                unit,
                count,
                resolved_since: range.since,
                resolved_until: range.until,
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
