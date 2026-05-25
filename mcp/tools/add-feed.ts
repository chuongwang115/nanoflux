import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createFeed
} from "../../db/feeds";
import { fetchFeedMetadata } from "../../services/feed-fetcher";

export function registerAddFeed(server: McpServer): void {
  server.registerTool(
    "add_feed",
    {
      description:
        "Add an RSS feed source. Provide url; title and description are optional and fetched from the feed when omitted.",
      inputSchema: {
        url: z.string().url().describe("RSS/Atom feed URL (http or https)"),
        title: z
          .string()
          .min(1)
          .optional()
          .describe("Feed title; auto-fetched from the feed when omitted"),
        description: z
          .string()
          .nullable()
          .optional()
          .describe(
            "Feed description; auto-fetched when omitted, pass null to store no description",
          ),
      },
    },
    async ({ url, title, description }) => {

      const feedUrl = url.trim();

      let feedTitle = title?.trim();
      let feedDescription =
        description !== undefined ? description : undefined;

      if (!feedTitle || feedDescription === undefined) {
        try {
          const meta = await fetchFeedMetadata(feedUrl);
          if (!feedTitle) {
            feedTitle = meta.title || feedUrl;
          }
          if (feedDescription === undefined) {
            feedDescription = meta.description;
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to parse feed";
          throw new Error(`Could not fetch feed metadata: ${message}`);
        }
      }

      if (!feedTitle) {
        throw new Error("title is required when feed metadata has no title");
      }

      try {
      
        const feed = createFeed({
          title: feedTitle,
          url: feedUrl,
          description: feedDescription ?? null,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  created: true,
                  feed: {
                    id: feed.id,
                    title: feed.title,
                    url: feed.url,
                    description: feed.description,
                    created_at: feed.created_at,
                    updated_at: feed.updated_at,
                  },
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {

        const message =
          error instanceof Error ? error.message : "Failed to create feed";
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                created: false,
                error: message,
              }),
            },
          ],
        }
      }
    },
  );
}
