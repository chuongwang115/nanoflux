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
  filter_passed: boolean | null;
  passed_filters: string | null;
  feed_title: string;
};

export type ItemsPage = {
  data: Item[];
  nextCursor: string | null;
  hasMore: boolean;
};

type RawItem = Omit<Item, "is_read" | "filter_passed"> & {
  is_read: boolean | number;
  filter_passed: boolean | number | null;
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
    filter_passed:
      raw.filter_passed === null || raw.filter_passed === undefined
        ? null
        : Boolean(raw.filter_passed),
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
  passedFilterId?: string,
): Promise<ItemsPage> {
  const params = new URLSearchParams({
    limit: String(limit),
  });
  if (filterPassed === 0 || filterPassed === 1) {
    params.set("filter_passed", String(filterPassed));
  }
  if (cursor) params.set("cursor", cursor);
  if (isRead === 0 || isRead === 1) params.set("is_read", String(isRead));
  if (passedFilterId) params.set("passed_filter_id", passedFilterId);
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

export async function markAllItemsRead(
  until: string,
  options?: {
    filterPassed?: 0 | 1;
    passedFilterId?: string;
  },
) {
  if (!until) {
    throw new Error("Missing until timestamp");
  }
  const payload: {
    until: string;
    filter_passed?: 0 | 1;
    passed_filter_id?: string;
  } = { until };
  if (options?.filterPassed === 0 || options?.filterPassed === 1) {
    payload.filter_passed = options.filterPassed;
  }
  if (options?.passedFilterId) {
    payload.passed_filter_id = options.passedFilterId;
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

export async function setItemFilterVerdict(
  itemId: string,
  filterId: string,
  verdict: "accept" | "reject",
) {
  const body = await request<
    ApiResult & {
      data?: { passed_filters: string | null; is_read: number };
    }
  >(`/api/items/${itemId}/filter-verdict`, {
    method: "POST",
    body: JSON.stringify({ filter_id: filterId, verdict }),
  });
  assertApiOk(body);
  return body.data;
}

export type Filter = {
  id: string;
  name: string;
  whitelist: string;
  blacklist: string;
  prompt: string;
};

type FiltersApiResult = {
  code: number;
  message: string;
  data?: {
    filters: Filter[];
  };
};

type FilterApiResult = {
  code: number;
  message: string;
  data?: Filter;
};

export async function fetchFilters(): Promise<Filter[]> {
  const body = await request<FiltersApiResult>("/api/filters");
  assertApiOk(body);
  if (!body.data) {
    throw new Error(body.message || "Failed to load filters");
  }
  return body.data.filters;
}

export function createFilter(payload: {
  name: string;
  whitelist: string;
  blacklist: string;
  prompt: string;
}) {
  return request<FilterApiResult>("/api/filters/create", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to create filter");
    }
    return body.data;
  });
}

export function updateFilter(
  id: string,
  payload: {
    name: string;
    whitelist: string;
    blacklist: string;
    prompt: string;
  },
) {
  return request<FilterApiResult>(`/api/filters/${id}`, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to update filter");
    }
    return body.data;
  });
}

export function deleteFilter(id: string) {
  return request<ApiResult>(`/api/filters/${id}/delete`, {
    method: "POST",
  }).then((body) => {
    assertApiOk(body);
  });
}

export type FilterReorderAction = "up" | "down" | "top" | "bottom";

export function reorderFilter(id: string, action: FilterReorderAction) {
  return request<FiltersApiResult>(`/api/filters/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ action }),
  }).then((body) => {
    assertApiOk(body);
    if (!body.data) {
      throw new Error(body.message || "Failed to reorder filters");
    }
    return body.data.filters;
  });
}
