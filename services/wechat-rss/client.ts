import { getAllFeeds } from "../../db/feeds";
import { httpDelete, httpGet, httpPost } from "../http-fetcher";

const WECHATRSS_BASE = "https://wechatrss.waytomaster.com";
const WECHATRSS_FEED_PATH = "/api/rss/";
const REQUEST_TIMEOUT_MS = 30_000;
const SUBSCRIPTIONS_CACHE_MS = 60_000;

export type WechatRssConfig = {
  apiKey: string;
  apiSecret: string;
};

export type WechatAccount = {
  fakeid: string;
  nickname: string;
  alias: string;
  round_head_img: string;
  service_type: number;
  subscribed?: boolean;
  rss_url?: string | null;
};

export type WechatSubscription = {
  id: number;
  fakeid: string;
  nickname: string;
  alias: string;
  head_img: string;
  rss_url: string;
  is_active: boolean;
};

let subscriptionsCache:
  | { at: number; data: WechatSubscription[] }
  | null = null;

export function getWechatRssConfig(): WechatRssConfig | null {
  const apiKey = process.env.WECHATRSS_API_KEY?.trim();
  const apiSecret = process.env.WECHATRSS_API_SECRET?.trim();
  if (!apiKey || !apiSecret) return null;
  return { apiKey, apiSecret };
}

function authHeaders(config: WechatRssConfig): Record<string, string> {
  return {
    "X-API-Key": config.apiKey,
    "X-API-Secret": config.apiSecret,
    Accept: "application/json",
  };
}

async function wechatGet(path: string, config: WechatRssConfig): Promise<Response> {
  return httpGet(`${WECHATRSS_BASE}${path}`, {
    headers: authHeaders(config),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function wechatPost(
  path: string,
  config: WechatRssConfig,
  body: unknown,
): Promise<Response> {
  return httpPost(`${WECHATRSS_BASE}${path}`, {
    headers: {
      ...authHeaders(config),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function wechatDelete(
  path: string,
  config: WechatRssConfig,
): Promise<Response> {
  return httpDelete(`${WECHATRSS_BASE}${path}`, {
    headers: authHeaders(config),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

/** Extract fakeid from a WeChat RSS feed URL, or null if not a WeChat RSS URL. */
export function parseWechatFakeidFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    if (parsed.origin !== WECHATRSS_BASE) return null;
    if (!parsed.pathname.startsWith(WECHATRSS_FEED_PATH)) return null;
    const fakeid = decodeURIComponent(
      parsed.pathname.slice(WECHATRSS_FEED_PATH.length),
    ).replace(/\/$/, "");
    return fakeid || null;
  } catch {
    return null;
  }
}

function detailMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object") {
    const msg = (detail[0] as { msg?: string }).msg;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
  }
  const message = (body as { message?: string }).message;
  if (typeof message === "string" && message.trim()) return message.trim();
  return fallback;
}

function invalidateSubscriptionsCache() {
  subscriptionsCache = null;
}

export async function searchWechatAccounts(
  query: string,
): Promise<WechatAccount[]> {
  const config = getWechatRssConfig();
  if (!config) {
    throw new Error("WeChat RSS is not configured");
  }

  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("query must not be empty");
  }

  const response = await wechatGet(
    `/api/search/accounts?query=${encodeURIComponent(trimmed)}`,
    config,
  );
  const body = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    list?: WechatAccount[];
    detail?: unknown;
    message?: string;
  };

  if (!response.ok || body.success === false) {
    throw new Error(detailMessage(body, `HTTP ${response.status}`));
  }

  const list = Array.isArray(body.list) ? body.list : [];
  const localByFakeid = new Map<string, string>();
  for (const feed of getAllFeeds()) {
    const fakeid = parseWechatFakeidFromUrl(feed.url);
    if (fakeid && !localByFakeid.has(fakeid)) {
      localByFakeid.set(fakeid, feed.url);
    }
  }

  return list.map((account) => {
    const localUrl = localByFakeid.get(account.fakeid);
    return {
      fakeid: account.fakeid,
      nickname: account.nickname ?? "",
      alias: account.alias ?? "",
      round_head_img: account.round_head_img ?? "",
      service_type: account.service_type ?? -1,
      subscribed: Boolean(localUrl),
      rss_url: localUrl ?? null,
    };
  });
}

export async function listWechatSubscriptions(
  options?: { force?: boolean },
): Promise<WechatSubscription[]> {
  const config = getWechatRssConfig();
  if (!config) {
    throw new Error("WeChat RSS is not configured");
  }

  const now = Date.now();
  if (
    !options?.force &&
    subscriptionsCache &&
    now - subscriptionsCache.at < SUBSCRIPTIONS_CACHE_MS
  ) {
    return subscriptionsCache.data;
  }

  const response = await wechatGet("/api/subscriptions", config);
  const body = (await response.json().catch(() => ({}))) as {
    subscriptions?: WechatSubscription[];
    detail?: unknown;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(detailMessage(body, `HTTP ${response.status}`));
  }

  const data = Array.isArray(body.subscriptions) ? body.subscriptions : [];
  subscriptionsCache = { at: now, data };
  return data;
}

export async function subscribeWechatAccount(account: {
  fakeid: string;
  nickname: string;
  alias?: string;
  head_img?: string;
}): Promise<{ rss_url: string; message?: string }> {
  const config = getWechatRssConfig();
  if (!config) {
    throw new Error("WeChat RSS is not configured");
  }

  const fakeid = account.fakeid.trim();
  if (!fakeid) {
    throw new Error("fakeid must not be empty");
  }

  const response = await wechatPost("/api/subscriptions/subscribe", config, {
    fakeid,
    nickname: account.nickname.trim(),
    alias: account.alias?.trim() ?? "",
    head_img: account.head_img?.trim() ?? "",
  });
  const body = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    rss_url?: string;
    detail?: unknown;
  };

  if (!response.ok || body.success === false) {
    throw new Error(detailMessage(body, `HTTP ${response.status}`));
  }

  const rssUrl = body.rss_url?.trim();
  if (!rssUrl) {
    throw new Error("Subscribe succeeded but no rss_url returned");
  }

  invalidateSubscriptionsCache();
  return { rss_url: rssUrl, message: body.message };
}

export async function unsubscribeWechatAccount(
  fakeid: string,
): Promise<{ message?: string }> {
  const config = getWechatRssConfig();
  if (!config) {
    throw new Error("WeChat RSS is not configured");
  }

  const trimmed = fakeid.trim();
  if (!trimmed) {
    throw new Error("fakeid must not be empty");
  }

  const response = await wechatDelete(
    `/api/subscriptions/subscribe/${encodeURIComponent(trimmed)}`,
    config,
  );
  const body = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    detail?: unknown;
  };

  if (!response.ok || body.success === false) {
    throw new Error(detailMessage(body, `HTTP ${response.status}`));
  }

  invalidateSubscriptionsCache();
  return { message: body.message };
}

/** Best-effort remote unsubscribe when deleting a WeChat RSS feed URL. */
export async function unsubscribeWechatFeedUrl(
  url: string,
): Promise<void> {
  const fakeid = parseWechatFakeidFromUrl(url);
  if (!fakeid || !getWechatRssConfig()) return;
  await unsubscribeWechatAccount(fakeid);
}

export type ResolvedWechatFeed = {
  title: string;
  url: string;
  description: string | null;
};

export async function resolveWechatFeed(account: {
  fakeid: string;
  nickname: string;
  alias?: string;
  head_img?: string;
}): Promise<ResolvedWechatFeed> {
  const fakeid = account.fakeid.trim();
  if (!fakeid) {
    throw new Error("fakeid must not be empty");
  }

  const nickname = account.nickname.trim() || fakeid;
  const alias = account.alias?.trim() || "";
  const description = alias || null;

  const subscriptions = await listWechatSubscriptions();
  const match = subscriptions.find((sub) => sub.fakeid === fakeid);
  if (match?.rss_url) {
    return {
      title: (match.nickname || nickname).trim(),
      url: match.rss_url,
      description: alias || match.alias?.trim() || null,
    };
  }

  const subscribed = await subscribeWechatAccount({
    fakeid,
    nickname,
    alias,
    head_img: account.head_img,
  });

  return {
    title: nickname,
    url: subscribed.rss_url,
    description,
  };
}
