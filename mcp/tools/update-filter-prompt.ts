import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  hasFilterPrompt,
  updateFilterPrompt,
} from "../../filter";

export function registerUpdateFilterPrompt(server: McpServer): void {
  server.registerTool(
    "update_filter_prompt",
    {
      description:
        "Set the AI content filter prompt used to decide whether new articles are relevant. Pass an empty string to disable filtering (all items pass by default). Changes apply to newly fetched items only.",
      inputSchema: {
        prompt: z
          .string()
          .describe(
            "Filter criteria for the LLM. Empty string disables filtering.",
          ),
      },
    },
    async ({ prompt }) => {
      try {
        const updated = await updateFilterPrompt(prompt);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  updated: true,
                  prompt: updated.prompt,
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
          error instanceof Error
            ? error.message
            : "Failed to update filter prompt";
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
