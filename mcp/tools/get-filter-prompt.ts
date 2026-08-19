import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFilterConfig, hasFilterPrompt } from "../../filter";

export function registerGetFilterPrompt(server: McpServer): void {
  server.registerTool(
    "get_filter_prompt",
    {
      description:
        "Get the AI content filter prompt and whether filtering is enabled. Filtering runs only when enabled is true and prompt is non-empty; otherwise all items pass by default.",
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
                  active: hasFilterPrompt(),
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to get filter prompt";
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: message }) },
          ],
        };
      }
    },
  );
}
