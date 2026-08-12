import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendTelegramMessage } from "../../services/telegram/client";

export function registerSendTelegramMessage(server: McpServer): void {
  server.registerTool(
    "send_telegram_message",
    {
      description:
        "Post a title + URL message to the configured Telegram channel via Bot API. Uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID from the server environment. The bot must be an admin of that channel.",
      inputSchema: {
        title: z
          .string()
          .min(1)
          .max(4000)
          .describe("Message title / headline"),
        url: z
          .string()
          .url()
          .max(2048)
          .describe("Link URL to include after the title"),
        parse_mode: z
          .enum(["HTML", "Markdown", "MarkdownV2"])
          .optional()
          .describe("Optional Telegram parse mode for formatting"),
        disable_notification: z
          .boolean()
          .optional()
          .describe("When true, send silently without notifying subscribers"),
      },
    },
    async ({ title, url, parse_mode, disable_notification }) => {
      try {
        const text = `${title.trim()}\n${url.trim()}`;
        if (text.length > 4096) {
          throw new Error(
            `Combined title + url exceeds Telegram limit (${text.length}/4096)`,
          );
        }
        const result = await sendTelegramMessage({
          text,
          parseMode: parse_mode,
          disableNotification: disable_notification,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sent: true,
                  message_id: result.messageId,
                  chat_id: result.chatId,
                  date: result.date,
                  text: result.text,
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
            : "Failed to send Telegram message";
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ sent: false, error: message }),
            },
          ],
        };
      }
    },
  );
}
