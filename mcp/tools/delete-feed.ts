import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deleteFeed, getFeedById } from "../../db/feeds";

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

export function registerDeleteFeed(server: McpServer): void {
  server.registerTool(
    "delete_feed",
    {
      description: "Delete an RSS feed by id. Associated news items are removed.",
      inputSchema: {
        id: z.string().min(1).describe("Feed id"),
      },
    },
    async ({ id }) => {
      const existing = getFeedById(id);
      if (!existing) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { deleted: false, error: "Feed not found", id },
                null,
                2,
              ),
            },
          ],
        };
      }

      deleteFeed(id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { deleted: true, feed: formatFeed(existing) },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
