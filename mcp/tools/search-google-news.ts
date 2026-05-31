import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchGoogleNews } from "../../services/google-news";

const googleNewsTimeWindowSchema = z
  .enum(["1h", "1d", "3d", "7d", "1m"])
  .describe(
    "Google News time filter appended as when:<value> (1h=1 hour, 1d=1 day, 3d=3 days, 7d=7 days, 1m=1 month)",
  );

export function registerSearchGoogleNews(server: McpServer): void {
  server.registerTool(
    "search_google_news",
    {
      description:
        "Search Google News. Supports keyword query (e.g. AI, Tesla), optional time window (when), and language (hl). Results are live from Google News, not from the local NanoFlux database.",
      inputSchema: {
        keyword: z
          .string()
          .min(1)
          .describe(
            "Search query for Google News (e.g. AI, Tesla)",
          ),
        when: googleNewsTimeWindowSchema
          .optional()
          .describe(
            "Limit results to recent news; sent as when:<value> in the query",
          ),
        language: z
          .string()
          .optional()
          .describe(
            "BCP 47 language tag for results (hl), e.g. zh-CN, en-US (default en-US)",
          ),
      },
    },
    async ({ keyword, when, language }) => {
      try {
        const result = await searchGoogleNews({
          keyword,
          when,
          language,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch Google News";
        throw new Error(`Google News search failed: ${message}`);
      }
    },
  );
}
