import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deleteFeed, getFeed } from "../../db/feeds";
import { unsubscribeWechatFeedUrl } from "../../services/wechat-rss/client";

export function registerDeleteFeed(server: McpServer): void {
  server.registerTool(
    "delete_feed",
    {
      description:
        "Delete an RSS feed by id. Associated news items are removed. WeChat RSS feeds are also unsubscribed remotely when configured.",
      inputSchema: {
        id: z.string().min(1).describe("Feed id"),
      },
    },
    async ({ id }) => {
      try {
        const feed = getFeed(id);
        const deleted = deleteFeed(id);

        if (feed?.url) {
          try {
            await unsubscribeWechatFeedUrl(feed.url);
          } catch (error) {
            console.warn(
              "[wechat-rss] MCP unsubscribe failed:",
              error instanceof Error ? error.message : error,
            );
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  deleted,
                  message: "Feed deleted successfully",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete feed";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ deleted: false, error: message }),
            },
          ],
        };
      }
    },
  );
}
