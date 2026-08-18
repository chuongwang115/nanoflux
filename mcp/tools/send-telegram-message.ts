import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendTelegramMessage } from "../../services/telegram/client";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Convert ISO 3166-1 alpha-2 to a regional-indicator flag emoji (e.g. CN → 🇨🇳). */
function countryCodeToFlag(country: string): string {
  const code = country.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    throw new Error(
      `Invalid country code "${country.trim()}": expected ISO 3166-1 alpha-2 (e.g. CN, US)`,
    );
  }
  const base = 0x1f1e6; // Regional Indicator Symbol Letter A
  return String.fromCodePoint(
    base + code.charCodeAt(0) - 65,
    base + code.charCodeAt(1) - 65,
  );
}

function buildTelegramText(
  title: string,
  url: string,
  country?: string | null,
): string {
  const flag =
    country != null && country.trim() !== ""
      ? `${countryCodeToFlag(country)} `
      : "";
  return `${flag}<b>${escapeHtml(title.trim())}</b>\n${escapeHtml(url.trim())}`;
}

export function registerSendTelegramMessage(server: McpServer): void {
  server.registerTool(
    "send_telegram_message",
    {
      description:
        "Post a title + URL message to the configured Telegram channel via Bot API. The title is rendered in bold (HTML). Optional country (ISO 3166-1 alpha-2) is shown as a flag emoji before the title. Uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID from the server environment. The bot must be an admin of that channel.",
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
        country: z
          .string()
          .max(2)
          .optional()
          .nullable()
          .describe(
            "Optional ISO 3166-1 alpha-2 country code (e.g. CN, US). Shown as a flag emoji before the title. Omit, null, or empty to skip",
          ),
        disable_notification: z
          .boolean()
          .optional()
          .describe("When true, send silently without notifying subscribers"),
      },
    },
    async ({ title, url, country, disable_notification }) => {
      try {
        const text = buildTelegramText(title, url, country);
        if (text.length > 4096) {
          throw new Error(
            `Combined title + url exceeds Telegram limit (${text.length}/4096)`,
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
