import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFeed } from "../../db/feeds";
import { fetchFeedMetadata } from "../../services/feeds/fetcher";
import { buildKeywordGoogleNewsFeedUrl } from "../../services/google-news";

export function registerAddFeedByKeyword(server: McpServer): void {
  server.registerTool(
    "add_feed_by_keyword",
    {
      description:
        "Create an RSS feed from a Google News keyword search (last 3 days). Only keyword is required; language (hl) is inferred from the keyword (Chinese → zh-CN, otherwise en-US).",
      inputSchema: {
        keyword: z
          .string()
          .min(1)
          .describe(
            "Search keyword for Google News (e.g. AI, Tesla, 人工智能)",
          ),
      },
    },
    async ({ keyword }) => {
      const trimmed = keyword.trim();
      if (!trimmed) {
        throw new Error("keyword must not be empty");
      }

      const feedUrl = buildKeywordGoogleNewsFeedUrl(trimmed);
      let description: string | null = null;

      try {
        const meta = await fetchFeedMetadata(feedUrl);
        description = meta.description;
      } catch {
        // Metadata is optional; still create the feed with the keyword as title.
      }

      try {
        const feed = createFeed({
          title: trimmed,
          url: feedUrl,
          description,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  created: true,
                  keyword: trimmed,
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
                keyword: trimmed,
                url: feedUrl,
                error: message,
              }),
            },
          ],
        };
      }
    },
  );
}
