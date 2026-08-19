import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { deleteItem } from "../../db/items";

export function registerDeleteItem(server: McpServer): void {
  server.registerTool(
    "delete_item",
    {
      description:
        "Soft-delete a news item by id. The item is hidden from news queries and the UI, but is kept so the same article is not fetched again.",
      inputSchema: {
        id: z.string().min(1).describe("Item id"),
      },
    },
    async ({ id }) => {
      try {
        const deleted = deleteItem(id);

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
