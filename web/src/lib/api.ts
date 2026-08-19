import { localeState } from "./locale.svelte";

export type FeedSort = "updated_desc" | "published_desc" | "published_asc";

export type Feed = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  last_published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: string;
  feed_id: string;
  guid: string;
  title: string;
  link: string;
  content: string | null;
  published_at: string;
  is_read: boolean;
  /** `1` when the item passed (or filtering was off); `0` when the AI rejected it. */
  filter_passed: 0 | 1;
  /** Pass reason text when the item passed the AI filter; `null` when rejected or filtering was off. */
  passed_reason: string | null;
  feed_title: string;
};

export type ItemsPage = {
  data: Item[];
  nextCursor: string | null;
  hasMore: boolean;
};

type RawItem = Omit<Item, "is_read" | "filter_passed"> & {
  is_read: boolean | number;
  filter_passed: boolean | number;
};

type ItemsApiResult = {
  code: number;
  message: string;
  data?: {
    items: RawItem[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

type ApiResult = {
  code: number;
  message: string;
};

function assertApiOk(body: ApiResult): void {
  if (body.code !== 0) {
    throw new Error(body.message || "Request failed");
  }
}

export function normalizeItem(raw: RawItem): Item {
  return {
    ...raw,
    is_read: Boolean(raw.is_read),
    filter_passed: Number(raw.filter_passed) === 1 ? 1 : 0,
    passed_reason:
      raw.passed_reason === null || raw.passed_reason === undefined
        ? null
        : String(raw.passed_reason),
  };
}

export type FeedsPage = {
  data: Feed[];
  nextCursor: string | null;
  hasMore: boolean;
};

type FeedsApiResult = {
  code: number;
  message: string;
  data?: {
    feeds: Feed[];
    hasMore: boolean;
    nextCursor: string | null;
  };
};

async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (body as { error?: string; message?: string }).error ??
      (body as { message?: string }).message;
    throw new Error(message || `Request failed (${res.status})`);
  }
  return body as T;
}

export async function fetchItemsPage(
  cursor?: string,
  limit = 20,
  filterPassed?: 0 | 1,
  isRead?: 0 | 1,
): Promise<ItemsPage> {
  const params = new URLSearchParams({
    limit: String(limit),
  });
  if (filterPassed === 0 || filterPassed === 1) {
    params.set("filter_passed", String(filterPassed));
  }
  if (cursor) params.set("cursor", cursor);
  if (isRead === 0 || isRead === 1) params.set("is_read", String(isRead));
  const body = await request<ItemsApiResult>(`/api/items?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load items");
  }
  return {
    data: body.data.items.map(normalizeItem),
    nextCursor: body.data.nextCursor,
    hasMore: body.data.hasMore,
  };
}

export async function fetchFeedsPage(
  cursor?: string,
  limit = 20,
  keyword?: string,
  sort: FeedSort = "updated_desc",
): Promise<FeedsPage> {
  const params = new URLSearchParams({ limit: String(limit), sort });
  if (cursor) params.set("cursor", cursor);
  if (keyword) params.set("keyword", keyword);
  const body = await request<FeedsApiResult>(`/api/feeds?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load feeds");
  }
  return {
    data: body.data.feeds,
    nextCursor: body.data.nextCursor,
    hasMore: body.data.hasMore,
  };
}

export function previewFeed(url: string) {
  const params = new URLSearchParams({ url });
  return request<{ data: { title: string; description: string | null } }>(
    `/api/feeds/meta?${params}`, { 
      method: "POST",
      body: JSON.stringify({ url }),
    }
  );
}

export type WechatAccount = {
  fakeid: string;
  nickname: string;
  alias: string;
  round_head_img: string;
  service_type: number;
  subscribed?: boolean;
  rss_url?: string | null;
};

export async function searchWechatAccounts(
  query: string,
): Promise<WechatAccount[]> {
  const params = new URLSearchParams({ query: query.trim() });
  const body = await request<{
    code: number;
    message: string;
    data?: { accounts: WechatAccount[] };
  }>(`/api/feeds/wechat/accounts?${params}`);
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to search WeChat accounts");
  }
  return body.data.accounts;
}

export async function resolveWechatFeed(account: {
  fakeid: string;
  nickname: string;
  alias?: string;
  head_img?: string;
}): Promise<{ title: string; url: string; description: string | null }> {
  const body = await request<{
    code: number;
    message: string;
    data?: { title: string; url: string; description: string | null };
  }>("/api/feeds/wechat/resolve", {
    method: "POST",
    body: JSON.stringify(account),
  });
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to resolve WeChat feed");
  }
  return body.data;
}

export function createFeed(payload: {
  title: string;
  url: string;
  description: string | null;
}) {
  return request<{ data: Feed }>("/api/feeds/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateFeed(
  id: string,
  payload: { 
    title: string; 
    url: string;
    description: string | null },
) {
  return request<{ data: Feed }>(`/api/feeds/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteFeed(id: string) {
  return request<{ success: boolean }>(`/api/feeds/${id}/delete`, {
    method: "POST",
  });
}

export async function downloadFeedsOpml(): Promise<void> {
  const res = await fetch("/api/feeds/export.opml");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nanoflux.opml";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadItemsExcel(options: {
  since?: string;
  until?: string;
  filterPassed?: 0 | 1;
}): Promise<void> {
  const params = new URLSearchParams();
  if (options.since) params.set("since", options.since);
  if (options.until) params.set("until", options.until);
  if (options.filterPassed === 0 || options.filterPassed === 1) {
    params.set("filter_passed", String(options.filterPassed));
  }
  params.set("tz_offset", String(new Date().getTimezoneOffset()));
  params.set("lang", localeState.locale);

  const res = await fetch(`/api/items/export.xlsx?${params}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nanoflux-export.xlsx";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function markAllItemsRead(
  until: string,
  options?: {
    filterPassed?: 0 | 1;
  },
) {
  if (!until) {
    throw new Error("Missing until timestamp");
  }
  const payload: {
    until: string;
    filter_passed?: 0 | 1;
  } = { until };
  if (options?.filterPassed === 0 || options?.filterPassed === 1) {
    payload.filter_passed = options.filterPassed;
  }
  const body = await request<ApiResult>("/api/items/read-all", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  assertApiOk(body);
}

export async function markItemRead(id: string) {
  const body = await request<ApiResult>(`/api/items/${id}/read`, {
    method: "POST",
  });
  assertApiOk(body);
}

export type FilterConfig = {
  prompt: string;
  enabled: boolean;
};

type FilterApiResult = {
  code: number;
  message: string;
  data?: Partial<FilterConfig>;
};

function normalizeFilterConfig(
  data: Partial<FilterConfig> | undefined,
  defaults?: Partial<FilterConfig>,
): FilterConfig {
  const prompt =
    typeof data?.prompt === "string" ? data.prompt : (defaults?.prompt ?? "");
  return {
    prompt,
    enabled:
      typeof data?.enabled === "boolean"
        ? data.enabled
        : typeof defaults?.enabled === "boolean"
          ? defaults.enabled
          : false,
  };
}

export async function fetchFilter(): Promise<FilterConfig> {
  const body = await request<FilterApiResult>("/api/filter");
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load filter");
  }
  return normalizeFilterConfig(body.data);
}

export function updateFilter(payload: { prompt?: string; enabled?: boolean }) {
  return request<FilterApiResult>("/api/filter", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to update filter");
    }
    return normalizeFilterConfig(body.data, payload);
  });
}
