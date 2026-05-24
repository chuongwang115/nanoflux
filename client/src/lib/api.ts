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

export function fetchItemsPage(cursor?: string, limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return request<ItemsPage>(`/api/items?${params}`);
}

export function fetchFeeds() {
  return request<{ data: Feed[] }>("/api/feeds");
}

export function previewFeed(url: string) {
  const params = new URLSearchParams({ url });
  return request<{ data: { title: string; description: string | null } }>(
    `/api/feeds/meta?${params}`,
  );
}

export function createFeed(payload: {
  title: string;
  url: string;
  description: string | null;
}) {
  return request<{ data: Feed }>("/api/feeds", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateFeed(
  id: string,
  payload: { title: string; description: string | null },
) {
  return request<{ data: Feed }>(`/api/feeds/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteFeed(id: string) {
  return request<{ success: boolean }>(`/api/feeds/${id}`, {
    method: "DELETE",
  });
}

export function markAllItemsRead(until: string) {
  if (!until) {
    return Promise.reject(new Error("Missing until timestamp"));
  }
  return request<{ success: boolean }>("/api/items/read-all", {
    method: "POST",
    body: JSON.stringify({ until }),
  });
}

export function markItemRead(id: string) {
  return request<{ success: boolean }>(`/api/items/${id}/read`, {
    method: "POST",
  });
}
