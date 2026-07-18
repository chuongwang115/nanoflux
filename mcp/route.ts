import { mcp } from "elysia-mcp";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetCurrentTime } from "./tools/get-current-time";
import { registerAddFeed } from "./tools/add-feed";
import { registerAddFeedByKeyword } from "./tools/add-feed-by-keyword";
import { registerUpdateFeed } from "./tools/update-feed";
import { registerDeleteFeed } from "./tools/delete-feed";
import { registerSearchFeeds } from "./tools/search-feeds";
import { registerGetItems } from "./tools/get-items";
import { registerGetUnreadItems } from "./tools/get-unread-items";
import { registerMarkItemsRead } from "./tools/mark-items-read";
import { registerSearchGoogleNews } from "./tools/search-google-news";

export function registerMcpTools(server: McpServer): void {
  registerGetCurrentTime(server);
  registerAddFeed(server);
  registerAddFeedByKeyword(server);
  registerUpdateFeed(server);
  registerDeleteFeed(server);
  registerSearchFeeds(server);
  registerGetItems(server);
  registerGetUnreadItems(server);
  registerMarkItemsRead(server);
  registerSearchGoogleNews(server);
}

export const routes = mcp({
  basePath: "/mcp",
  enableJsonResponse: true,
  serverInfo: {
    name: "nanoflux",
    version: "1.0.0",
  },
  capabilities: {
    tools: {},
  },
  setupServer: async (server) => {
    registerMcpTools(server);
  },
});
