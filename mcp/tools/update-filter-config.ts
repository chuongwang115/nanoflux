import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  hasFilterPrompt,
  hasKeywordFilter,
  updateFilterConfig,
} from "../../filter";

export function registerUpdateFilterConfig(server: McpServer): void {
  server.registerTool(
    "update_filter_config",
    {
      description:
        "Set AI and keyword content filters for newly fetched articles. When keyword filtering is enabled, matching titles are rejected before AI filtering.",
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
        keywords: z
          .string()
          .optional()
          .describe("Comma-separated title keywords to reject when keyword filtering is enabled."),
      },
    },
    async ({ prompt, enabled, keywords }) => {
      try {
        const updated = await updateFilterConfig({
          prompt,
          enabled,
          keywords,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  updated: true,
                  prompt: updated.prompt,
                  enabled: updated.enabled,
                  keywords: updated.keywords,
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
          error instanceof Error
            ? error.message
            : "Failed to update filter config";
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
