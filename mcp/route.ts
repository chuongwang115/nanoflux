import { mcp } from "elysia-mcp";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerGetCurrentTime } from "./tools/get-current-time";
import { registerAddFeed } from "./tools/add-feed";
import { registerAddFeedByKeyword } from "./tools/add-feed-by-keyword";
import { registerAddWechatFeed } from "./tools/add-wechat-feed";
import { registerUpdateFeed } from "./tools/update-feed";
import { registerDeleteFeed } from "./tools/delete-feed";
import { registerSearchFeeds } from "./tools/search-feeds";
import { registerGetItems } from "./tools/get-items";
import { registerGetUnreadItems } from "./tools/get-unread-items";

export function registerMcpTools(server: McpServer): void {
  registerGetCurrentTime(server);
  registerAddFeed(server);
  registerAddFeedByKeyword(server);
  registerAddWechatFeed(server);
  registerUpdateFeed(server);
  registerDeleteFeed(server);
  registerSearchFeeds(server);
  registerGetItems(server);
  registerGetUnreadItems(server);
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
