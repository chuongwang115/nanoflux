import { httpPost } from "../http-fetcher";

const TELEGRAM_API_BASE = "https://api.telegram.org";
const REQUEST_TIMEOUT_MS = 30_000;

export type TelegramConfig = {
  botToken: string;
  channelId: string;
};

export type TelegramParseMode = "HTML" | "Markdown" | "MarkdownV2";

export type SendTelegramMessageInput = {
  text: string;
  /** Override `TELEGRAM_CHANNEL_ID` for this send. */
  chatId?: string;
  parseMode?: TelegramParseMode;
  disableNotification?: boolean;
};

export type SendTelegramMessageResult = {
  messageId: number;
  chatId: number | string;
  date: number;
  text: string;
};

type TelegramApiResponse<T> = {
  ok: boolean;
  description?: string;
  result?: T;
};

type TelegramMessageResult = {
  message_id: number;
  date: number;
  text?: string;
  chat: {
    id: number;
    title?: string;
    username?: string;
    type: string;
  };
};

export function getTelegramConfig(): TelegramConfig | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const channelId = process.env.TELEGRAM_CHANNEL_ID?.trim();
  if (!botToken || !channelId) return null;
  return { botToken, channelId };
}

function requireConfig(): TelegramConfig {
  const config = getTelegramConfig();
  if (!config) {
    throw new Error(
      "Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID in .env",
    );
  }
  return config;
}

export async function sendTelegramMessage(
  input: SendTelegramMessageInput,
): Promise<SendTelegramMessageResult> {
  const config = requireConfig();
  const text = input.text.trim();
  if (!text) {
    throw new Error("Message text must not be empty");
  }

  const chatId = input.chatId?.trim() || config.channelId;
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
  };
  if (input.parseMode) {
    body.parse_mode = input.parseMode;
  }
  if (input.disableNotification) {
    body.disable_notification = true;
  }

  const url = `${TELEGRAM_API_BASE}/bot${config.botToken}/sendMessage`;
  const response = await httpPost(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const payload =
    (await response.json()) as TelegramApiResponse<TelegramMessageResult>;

  if (!response.ok || !payload.ok || !payload.result) {
    const detail =
      payload.description ||
      `Telegram API HTTP ${response.status} ${response.statusText}`;
    throw new Error(detail);
  }

  return {
    messageId: payload.result.message_id,
    chatId: payload.result.chat.id,
    date: payload.result.date,
    text: payload.result.text ?? text,
  };
}
