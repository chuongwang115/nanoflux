import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFilterPrompt, hasFilterPrompt } from "../../filter";

export function registerGetFilterPrompt(server: McpServer): void {
  server.registerTool(
    "get_filter_prompt",
    {
      description:
        "Get the AI content filter prompt. An empty prompt means filtering is disabled and all items pass by default.",
    },
    async () => {
      try {
        const prompt = getFilterPrompt();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  prompt,
                  enabled: hasFilterPrompt(),
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
