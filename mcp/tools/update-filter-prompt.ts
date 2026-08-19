import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  hasFilterPrompt,
  updateFilterConfig,
} from "../../filter";

export function registerUpdateFilterPrompt(server: McpServer): void {
  server.registerTool(
    "update_filter_prompt",
    {
      description:
        "Set the AI content filter prompt and/or enabled flag used to decide whether new articles are relevant. Filtering runs only when enabled is true and prompt is non-empty. Changes apply to newly fetched items only.",
      inputSchema: {
        prompt: z
          .string()
          .optional()
          .describe(
            "Filter criteria for the LLM. Empty string skips LLM filtering even if enabled.",
          ),
        enabled: z
          .boolean()
          .optional()
          .describe(
            "Turn AI filtering on or off without clearing the prompt.",
          ),
      },
    },
    async ({ prompt, enabled }) => {
      try {
        const updated = await updateFilterConfig({ prompt, enabled });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  updated: true,
                  prompt: updated.prompt,
                  enabled: updated.enabled,
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
