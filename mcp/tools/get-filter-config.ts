import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getFilterConfig,
  hasFilterPrompt,
  hasKeywordFilter,
} from "../../filter";

export function registerGetFilterConfig(server: McpServer): void {
  server.registerTool(
    "get_filter_config",
    {
      description:
        "Get the AI and keyword content filter configuration. Keyword filtering rejects title matches before AI filtering.",
    },
    async () => {
      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ...getFilterConfig(),
                  active: hasFilterPrompt() || hasKeywordFilter(),
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get filter config";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
