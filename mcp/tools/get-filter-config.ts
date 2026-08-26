import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getFilterConfig,
  hasFilterPrompt,
  hasKeywordFilter,
  hasSourceFilter,
} from "../../filter";

export function registerGetFilterConfig(server: McpServer): void {
  server.registerTool(
    "get_filter_config",
    {
      description:
        "Get the source, keyword, and AI content filter configuration. Sources are rejected first, then title keywords, then AI filtering.",
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
                  active: hasFilterPrompt() || hasKeywordFilter() || hasSourceFilter(),
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
