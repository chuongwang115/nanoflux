import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetCurrentTime(server: McpServer): void {
  server.registerTool(
    "get_current_time",
    {
      description:
        "Returns the server current time (UTC ISO 8601 and Unix millisecond timestamp)",
    },
    async () => {
      const now = new Date();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                iso: now.toISOString(),
                unix_ms: now.getTime(),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}
