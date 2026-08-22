import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deleteItem } from "../../db/items";

export function registerDeleteItem(server: McpServer): void {
  server.registerTool(
    "delete_item",
    {
      description:
        "Soft-delete a news item by id. The item is hidden from news queries and the UI, but is kept so the same article is not fetched again. A reason is required and stored as deleted_reason.",
      inputSchema: {
        id: z.coerce.number().int().positive().describe("Item id"),
        reason: z
          .string()
          .trim()
          .min(1)
          .describe("Why this item is being deleted"),
      },
    },
    async ({ id, reason }) => {
      try {
        const deleted = deleteItem(id, reason);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  deleted,
                  message: "Item deleted successfully",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete item";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ deleted: false, error: message }),
            },
          ],
        };
      }
    },
  );
}
