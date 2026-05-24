import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  listItemsInTimeRange,
  parseTimeUnit,
  resolveTimeRange,
} from "../../db/items";
import { timeUnitSchema } from "../schema";

export function registerGetNews(server: McpServer): void {
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
        unit: timeUnitSchema
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
        cursor: z
          .string()
          .optional()
          .describe(
            "Pagination cursor from a previous response (nextCursor); keep the same time range",
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
    async ({ since, until, unit, count, cursor, limit }) => {
      const hasAbsolute = since !== undefined || until !== undefined;
      const hasRelative = unit !== undefined || count !== undefined;

      if (hasAbsolute && hasRelative) {
        throw new Error(
          "Provide either since/until or unit/count, not both",
        );
      }
      if (!hasAbsolute && !hasRelative) {
        throw new Error(
          "Provide since/until or unit/count to specify the time range",
        );
      }

      let range: { since: string; until: string };
      let range_mode: "absolute" | "relative";

      if (hasRelative) {
        if (unit === undefined || count === undefined) {
          throw new Error(
            "Relative time range requires both unit and count",
          );
        }
        const parsedUnit = parseTimeUnit(unit);
        if (!parsedUnit) {
          throw new Error(`Invalid time unit: ${unit}`);
        }
        range = resolveTimeRange({ unit: parsedUnit, count });
        range_mode = "relative";
      } else {
        if (since === undefined || until === undefined) {
          throw new Error(
            "Absolute time range requires both since and until",
          );
        }
        if (Number.isNaN(Date.parse(since))) {
          throw new Error(`Invalid since timestamp: ${since}`);
        }
        if (Number.isNaN(Date.parse(until))) {
          throw new Error(`Invalid until timestamp: ${until}`);
        }
        if (since > until) {
          throw new Error("since must be before or equal to until");
        }
        range = resolveTimeRange({ since, until });
        range_mode = "absolute";
      }

      const { data: items, hasMore, nextCursor } = listItemsInTimeRange({
        ...range,
        cursor,
        limit,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                range_mode,
                ...(range_mode === "relative" ? { unit, count } : { since, until }),
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
