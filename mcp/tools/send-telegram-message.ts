import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendTelegramMessage } from "../../services/telegram/client";
import { toTelegramHtml } from "./send-telegram-digest";

const TELEGRAM_TEXT_LIMIT = 4096;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildTelegramText(
  title: string,
  url: string,
  tag?: string | null,
  content?: string | null,
): string {
  const trimmedTag = tag?.trim() ?? "";
  const headline =
    trimmedTag !== ""
      ? `【${escapeHtml(trimmedTag)}】${escapeHtml(title.trim())}`
      : escapeHtml(title.trim());
  const body = content?.trim() ? toTelegramHtml(content) : "";
  const lines = [`<b>${headline}</b>`];
  if (body) {
    lines.push(body);
  }
  lines.push(escapeHtml(url.trim()));
  return lines.join("\n");
}

export function registerSendTelegramMessage(server: McpServer): void {
  server.registerTool(
    "send_telegram_message",
    {
      description:
        "Post a title + URL message to the configured Telegram channel via Bot API. The title is rendered in bold (HTML). Optional tag is at most one item (country, industry, company, etc.); when set, the headline is shown as 【tag】title (all bold). Optional content is HTML (same Telegram HTML rules as send_telegram_digest) and is inserted between the title and URL. Uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID from the server environment. The bot must be an admin of that channel.",
      inputSchema: {
        title: z
          .string()
          .min(1)
          .max(4000)
          .describe("Message title / headline (shown in bold)"),
        url: z
          .string()
          .url()
          .max(2048)
          .describe("Link URL to include after the title"),
        tag: z
          .string()
          .trim()
          .max(64)
          .refine((value) => value === "" || !/[,，;；|/]/.test(value), {
            message:
              "tag must be a single item (country, industry, company, etc.); do not pass a list",
          })
          .optional()
          .nullable()
          .describe(
            "Optional single tag: country, industry, company, etc. At most one item; do not pass a list. When set, the bold headline is 【tag】title. Omit, null, or empty to skip",
          ),
        content: z
          .string()
          .max(4000)
          .optional()
          .nullable()
          .describe(
            "Optional HTML body between the title and URL. Use b/i/u/s/a/code/pre/blockquote; br, p, h1–h6, ul/ol/li are normalized for Telegram. Omit, null, or empty to skip",
          ),
        disable_notification: z
          .boolean()
          .optional()
          .describe("When true, send silently without notifying subscribers"),
      },
    },
    async ({ title, url, tag, content, disable_notification }) => {
      try {
        const text = buildTelegramText(title, url, tag, content);
        if (text.length > TELEGRAM_TEXT_LIMIT) {
          throw new Error(
            `Combined title + content + url exceeds Telegram limit (${text.length}/${TELEGRAM_TEXT_LIMIT})`,
          );
        }
        const result = await sendTelegramMessage({
          text,
          parseMode: "HTML",
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
