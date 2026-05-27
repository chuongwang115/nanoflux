export type Feed = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: string;
  feed_id: string;
  guid: string;
  title: string;
  link: string;
  description: string | null;
  published_at: string;
  is_read: boolean;
  feed_title: string;
};

export type ItemsPage = {
  data: Item[];
  nextCursor: string | null;
  hasMore: boolean;
};

type RawItem = Omit<Item, "is_read"> & { is_read: boolean | number };

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

function normalizeItem(raw: RawItem): Item {
  return {
    ...raw,
    is_read: Boolean(raw.is_read),
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
): Promise<ItemsPage> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
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
): Promise<FeedsPage> {
  const params = new URLSearchParams({ limit: String(limit) });
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

export async function markAllItemsRead(until: string) {
  if (!until) {
    throw new Error("Missing until timestamp");
  }
  const body = await request<ApiResult>("/api/items/read-all", {
    method: "POST",
    body: JSON.stringify({ until }),
  });
  assertApiOk(body);
}

export async function markItemRead(id: string) {
  const body = await request<ApiResult>(`/api/items/${id}/read`, {
    method: "POST",
  });
  assertApiOk(body);
}
