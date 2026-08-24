import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendTelegramMessage } from "../../services/telegram/client";

const TELEGRAM_TEXT_LIMIT = 4096;

const TELEGRAM_HTML_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ins",
  "s",
  "strike",
  "del",
  "a",
  "code",
  "pre",
  "blockquote",
  "span",
  "tg-spoiler",
  "tg-emoji",
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Map common layout HTML to Telegram-supported HTML so agent-written markup renders. */
export function toTelegramHtml(html: string): string {
  let s = html.trim();
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n\n").replace(/<p\b[^>]*>/gi, "");
  s = s.replace(/<\/div>/gi, "\n").replace(/<div\b[^>]*>/gi, "");
  s = s.replace(/<h[1-6]\b[^>]*>/gi, "<b>").replace(/<\/h[1-6]>/gi, "</b>\n");
  s = s.replace(/<li\b[^>]*>/gi, "• ").replace(/<\/li>/gi, "\n");
  s = s.replace(/<\/?(?:ul|ol)\b[^>]*>/gi, "\n");
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<\/?([a-z][\w-]*)\b[^>]*>/gi, (full, tag: string) =>
    TELEGRAM_HTML_TAGS.has(tag.toLowerCase()) ? full : "",
  );
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

export function buildDigestText(title: string, content: string): string {
  return `<b>${escapeHtml(title.trim())}</b>\n${toTelegramHtml(content)}`;
}

export function registerSendTelegramDigest(server: McpServer): void {
  server.registerTool(
    "send_telegram_digest",
    {
      description:
        "Post a daily-report style message to the configured Telegram channel via Bot API. Two fields: title (always bold) and content (HTML written by the agent for layout). Content is sent with parse_mode HTML. Prefer Telegram tags: b/strong, i/em, u, s, a href, code, pre, blockquote. Common layout tags are converted (br → newline, p/div → paragraphs, h1–h6 → bold, ul/ol/li → bullet lines). Other tags are stripped. Summarize; do not dump raw articles. Uses TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID. The bot must be a channel admin.",
      inputSchema: {
        title: z
          .string()
          .min(1)
          .max(400)
          .describe("Report title / headline (shown in bold; HTML escaped)"),
        content: z
          .string()
          .min(1)
          .max(4000)
          .describe(
            "Report body as HTML. Use b/i/u/s/a/code/pre/blockquote for formatting; br, p, h1–h6, ul/ol/li are normalized for Telegram",
          ),
      },
    },
    async ({ title, content }) => {
      try {
        const text = buildDigestText(title, content);
        if (!text.replace(/<[^>]+>/g, "").trim()) {
          throw new Error("Digest content is empty after HTML normalization");
        }
        if (text.length > TELEGRAM_TEXT_LIMIT) {
          throw new Error(
            `Combined title + content exceeds Telegram limit (${text.length}/${TELEGRAM_TEXT_LIMIT})`,
          );
        }
        const result = await sendTelegramMessage({
          text,
          parseMode: "HTML",
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
            : "Failed to send Telegram digest";
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
