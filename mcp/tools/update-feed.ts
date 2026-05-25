import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  updateFeed,
} from "../../db/feeds";

function formatFeed(feed: {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}) {
  return {
    id: feed.id,
    title: feed.title,
    url: feed.url,
    description: feed.description,
    created_at: feed.created_at,
    updated_at: feed.updated_at,
  };
}

export function registerUpdateFeed(server: McpServer): void {
  server.registerTool(
    "update_feed",
    {
      description:
        "Update an existing RSS feed by id. Provide at least one of title or description.",
      inputSchema: {
        id: z.string().min(1).describe("Feed id"),
        title: z
          .string()
          .min(1)
          .optional()
          .describe("New feed title"),
        description: z
          .string()
          .nullable()
          .optional()
          .describe("New description; pass null to clear"),
      },
    },
    async ({ id, title, description }) => {
      if (title === undefined && description === undefined) {
        throw new Error(
          "At least one of title or description must be provided",
        );
      }

      const input: {
        title?: string;
        url?: string;
        description?: string | null;
      } = {};

      if (title !== undefined) {
        input.title = title.trim();
      }
      if (description !== undefined) {
        input.description = description;
      }

      try {

        const updated = updateFeed(id, input);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { updated: true, feed: formatFeed(updated) },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update feed";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ updated: false, error: message }),
            },
          ],
        };
      }
    },
  );
}
