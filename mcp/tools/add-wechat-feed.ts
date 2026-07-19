import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createFeed } from "../../db/feeds";
import {
  resolveWechatFeed,
  searchWechatAccounts,
  type WechatAccount,
} from "../../services/wechat-rss/client";

function formatAccount(account: WechatAccount) {
  return {
    fakeid: account.fakeid,
    nickname: account.nickname,
    alias: account.alias,
    head_img: account.round_head_img,
    service_type: account.service_type,
    subscribed: Boolean(account.subscribed),
    rss_url: account.rss_url ?? null,
  };
}

function pickAccount(
  accounts: WechatAccount[],
  query: string,
  fakeid?: string,
): WechatAccount | null {
  if (fakeid) {
    const trimmed = fakeid.trim();
    return accounts.find((account) => account.fakeid === trimmed) ?? null;
  }

  if (accounts.length === 1) {
    return accounts[0] ?? null;
  }

  const needle = query.trim().toLowerCase();
  const exact = accounts.filter((account) => {
    const nickname = account.nickname.trim().toLowerCase();
    const alias = account.alias.trim().toLowerCase();
    return nickname === needle || (alias.length > 0 && alias === needle);
  });

  return exact.length === 1 ? (exact[0] ?? null) : null;
}

export function registerAddWechatFeed(server: McpServer): void {
  server.registerTool(
    "add_wechat_feed",
    {
      description:
        "Subscribe to a WeChat official account (公众号). Always searches accounts first by query, then subscribes to one result and adds it as a local NanoFlux feed. If multiple accounts match, pass fakeid from the returned candidates to select one. Requires WECHATRSS_API_KEY and WECHATRSS_API_SECRET. Idempotent if the feed URL already exists locally.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe(
            "Search keyword for WeChat accounts (e.g. nickname or alias). Search always runs before subscribe.",
          ),
        fakeid: z
          .string()
          .min(1)
          .optional()
          .describe(
            "Optional fakeid from search results. Required when query returns multiple matches.",
          ),
      },
    },
    async ({ query, fakeid }) => {
      const trimmedQuery = query.trim();

      try {
        const accounts = await searchWechatAccounts(trimmedQuery);
        const candidates = accounts.map(formatAccount);

        if (accounts.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  created: false,
                  query: trimmedQuery,
                  error: "No WeChat accounts matched the query",
                  accounts: [],
                }),
              },
            ],
          };
        }

        const selected = pickAccount(accounts, trimmedQuery, fakeid);
        if (!selected) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    created: false,
                    query: trimmedQuery,
                    needs_selection: true,
                    error: fakeid
                      ? "fakeid was not found in search results; pick one from accounts"
                      : "Multiple accounts matched; call again with fakeid from accounts",
                    accounts: candidates,
                  },
                  null,
                  2,
                ),
              },
            ],
          };
        }

        const resolved = await resolveWechatFeed({
          fakeid: selected.fakeid,
          nickname: selected.nickname,
          alias: selected.alias,
          head_img: selected.round_head_img,
        });

        const feed = createFeed({
          title: resolved.title,
          url: resolved.url,
          description: resolved.description,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  created: true,
                  query: trimmedQuery,
                  account: formatAccount(selected),
                  feed: {
                    id: feed.id,
                    title: feed.title,
                    url: feed.url,
                    description: feed.description,
                    created_at: feed.created_at,
                    updated_at: feed.updated_at,
                  },
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
            : "Failed to subscribe WeChat account";

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                created: false,
                query: trimmedQuery,
                fakeid: fakeid?.trim() || null,
                error: message,
              }),
            },
          ],
        };
      }
    },
  );
}
