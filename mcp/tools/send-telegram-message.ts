import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendTelegramMessage } from "../../services/telegram/client";

export function registerSendTelegramMessage(server: McpServer): void {
  server.registerTool(
    "send_telegram_message",
    {
      description:
        "Post a text message to a Telegram channel via Bot API. Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID. The bot must be an admin of the target channel. Optional chat_id overrides the default channel for one send.",
      inputSchema: {
        text: z
          .string()
          .min(1)
          .max(4096)
          .describe("Message body to send (Telegram limit 4096 characters)"),
        chat_id: z
          .string()
          .min(1)
          .optional()
          .describe(
            "Optional chat/channel id override (e.g. @mychannel or -100...). Defaults to TELEGRAM_CHANNEL_ID.",
          ),
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
    async ({ text, chat_id, parse_mode, disable_notification }) => {
      try {
        const result = await sendTelegramMessage({
          text,
          chatId: chat_id,
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
