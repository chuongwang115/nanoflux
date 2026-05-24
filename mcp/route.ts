import { mcp } from "elysia-mcp";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerAddFeed } from "./tools/add-feed";
import { registerDeleteFeed } from "./tools/delete-feed";
import { registerGetCurrentTime } from "./tools/get-current-time";
import { registerGetNews } from "./tools/get-news";
import { registerGetUnreadNews } from "./tools/get-unread-news";
import { registerMarkNewsRead } from "./tools/mark-news-read";
import { registerSearchFeeds } from "./tools/search-feeds";
import { registerSearchGoogleNews } from "./tools/search-google-news";
import { registerSearchNews } from "./tools/search-news";
import { registerUpdateFeed } from "./tools/update-feed";

export function registerMcpTools(server: McpServer): void {
  registerAddFeed(server);
  registerUpdateFeed(server);
  registerDeleteFeed(server);
  registerGetCurrentTime(server);
  registerGetNews(server);
  registerGetUnreadNews(server);
  registerSearchNews(server);
  registerSearchGoogleNews(server);
  registerSearchFeeds(server);
  registerMarkNewsRead(server);
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
