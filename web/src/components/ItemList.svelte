<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "../lib/locale.svelte";
  import { subscribeItemStream } from "../lib/item-stream";
  import {
    fetchFilters,
    fetchItemsPage,
    markAllItemsRead,
    markItemRead,
    type Filter,
    type Item,
  } from "../lib/api";
  import {
    getItemFilterDisplay,
    getMatchedContentPreview,
    parseMatchedKeywords,
  } from "../lib/highlight";
  import { parsePassedFilters } from "../../../shared/passed-filters";
  import { formatTime } from "../lib/utils";
  import {
    persistSelectedFilterId,
    readStoredSelectedFilterId,
    resolveSelectedFilterId,
    UNMATCHED_FILTER_ID,
  } from "../lib/selected-filter";
  import HighlightedText from "./HighlightedText.svelte";
  import MarkAllReadButton from "./buttons/MarkAllReadButton.svelte";

  const filterTooltipClass =
    "pointer-events-none absolute bottom-full left-0 z-20 mb-1 w-max max-w-xs rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-snug whitespace-normal text-neutral-600 opacity-0 shadow-sm transition-opacity group-hover/filter:opacity-100 group-focus-within/filter:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [@media(hover:none)]:opacity-100";

  const PAGE_SIZE = 20;
  /** Cap in-memory list after SSE inserts to avoid DOM bloat. */
  const MAX_LIST_ITEMS = 100;

  type ItemFilter = "unread" | "all";

  let items = $state<Item[]>([]);
  let cursor = $state<string | null>(null);
  let hasMore = $state(true);
  let loading = $state(false);
  let error = $state("");
  let sentinel = $state<HTMLDivElement | null>(null);
  let filter = $state<ItemFilter>("unread");
  let selectedFilterId = $state<string | null>(null);
  let filters = $state<Filter[]>([]);
  let filterNameById = $state(new Map<string, string>());
  /** Block list/SSE until filters and stored selection are restored (avoids unfiltered fetch on refresh). */
  let filtersInitialized = $state(false);
  /** Gate SSE merges until filter selection is restored from storage. */
  let streamReady = $state(false);
  let loadGeneration = 0;
  /** Bumps every minute so relative timestamps (e.g. "18 min ago") stay current. */
  let now = $state(Date.now());

  const filterIsRead = $derived(filter === "unread" ? (0 as const) : undefined);

  function filterTabClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  function itemMatchesSelectedFilter(item: Item): boolean {
    if (!selectedFilterId) return true;
    if (selectedFilterId === UNMATCHED_FILTER_ID) {
      return !item.passed_filters?.trim();
    }
    return parsePassedFilters(item.passed_filters ?? null).some(
      (entry) => entry.id === selectedFilterId,
    );
  }

  function fetchFilterPassed(): 0 | undefined {
    return selectedFilterId === UNMATCHED_FILTER_ID ? 0 : undefined;
  }

  function fetchPassedFilterId(): string | undefined {
    if (!selectedFilterId || selectedFilterId === UNMATCHED_FILTER_ID) {
      return undefined;
    }
    return selectedFilterId;
  }

  function resetList() {
    items = [];
    cursor = null;
    hasMore = true;
    error = "";
    loading = false;
  }

  async function loadMore() {
    if (!filtersInitialized || loading || !hasMore) return;
    const gen = ++loadGeneration;
    loading = true;
    error = "";

    try {
      const page = await fetchItemsPage(
        cursor ?? undefined,
        PAGE_SIZE,
        fetchFilterPassed(),
        filterIsRead,
        fetchPassedFilterId(),
      );
      if (gen !== loadGeneration) return;
      items = [...items, ...page.data];
      cursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (e) {
      if (gen !== loadGeneration) return;
      error = e instanceof Error ? e.message : t("items.loadFailed");
    } finally {
      if (gen === loadGeneration) loading = false;
    }
  }

  async function setReadFilter(next: ItemFilter) {
    if (next === filter) return;
    filter = next;
    loadGeneration++;
    resetList();
    await loadMore();
  }

  async function toggleFilterSelect(id: string) {
    selectedFilterId = selectedFilterId === id ? null : id;
    persistSelectedFilterId(selectedFilterId);
    loadGeneration++;
    resetList();
    await loadMore();
  }

  $effect(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  function itemMatchesListView(item: Item): boolean {
    if (!itemMatchesSelectedFilter(item)) return false;
    if (filter === "unread" && item.is_read) return false;
    return true;
  }

  function compareItem(a: Item, b: Item): number {
    const cmp = b.published_at.localeCompare(a.published_at);
    if (cmp !== 0) return cmp;
    return b.id.localeCompare(a.id);
  }

  function mergeIncomingItem(incoming: Item[]) {
    if (!streamReady || !incoming.length) return;
    const seen = new Set(items.map((n) => n.id));
    const fresh = incoming.filter((n) => !seen.has(n.id) && itemMatchesListView(n));
    if (!fresh.length) return;

    fresh.sort(compareItem);

    const merged: Item[] = [];
    let i = 0;
    let j = 0;
    while (i < fresh.length && j < items.length) {
      if (compareItem(fresh[i], items[j]) <= 0) {
        merged.push(fresh[i++]);
      } else {
        merged.push(items[j++]);
      }
    }
    while (i < fresh.length) merged.push(fresh[i++]);
    while (j < items.length) merged.push(items[j++]);
    items =
      merged.length > MAX_LIST_ITEMS
        ? merged.slice(0, MAX_LIST_ITEMS)
        : merged;
  }

  function handleOpenItem(item: Item) {
    if (item.is_read) return;
    if (filter === "unread") {
      items = items.filter((n) => n.id !== item.id);
    } else {
      items = items.map((n) =>
        n.id === item.id ? { ...n, is_read: true } : n,
      );
    }
    void markItemRead(item.id).catch(() => {
      if (filter === "unread") {
        items = [...items, { ...item, is_read: false }].sort(compareItem);
      } else {
        items = items.map((n) =>
          n.id === item.id ? { ...n, is_read: false } : n,
        );
      }
    });
  }

  export async function markAllRead() {
    if (items.length === 0) return;
    const until = items.reduce<string | undefined>((max, item) => {
      const publishedAt = item.published_at;
      if (!publishedAt) return max;
      if (!max || publishedAt > max) return publishedAt;
      return max;
    }, undefined);
    if (!until) return;
    await markAllItemsRead(until, {
      filterPassed: fetchFilterPassed(),
      passedFilterId: fetchPassedFilterId(),
    });
    if (filter === "unread") {
      items = items.filter((item) => item.published_at > until);
    } else {
      items = items.map((item) =>
        item.published_at <= until ? { ...item, is_read: true } : item,
      );
    }
  }

  onMount(() => {
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      try {
        const loaded = await fetchFilters();
        filters = loaded;
        filterNameById = new Map(loaded.map((f) => [f.id, f.name]));
        selectedFilterId = resolveSelectedFilterId(
          readStoredSelectedFilterId(),
          loaded,
        );
        persistSelectedFilterId(selectedFilterId);
      } catch {
        selectedFilterId = null;
        persistSelectedFilterId(null);
      }
      loadGeneration++;
      resetList();
      filtersInitialized = true;
      streamReady = true;
      unsubscribe = subscribeItemStream(mergeIncomingItem);
      await loadMore();
    })();

    const timer = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => {
      unsubscribe?.();
      streamReady = false;
      clearInterval(timer);
    };
  });
</script>

<div
  class="mb-6 flex items-center gap-4 {filters.length > 0
    ? 'justify-between'
    : 'justify-end'}"
>
  {#if filters.length > 0}
    <div
      class="flex min-w-0 flex-wrap items-center gap-3 text-xs"
      role="group"
      aria-label={t("items.activeFilters")}
    >
      {#each filters as f (f.id)}
        <button
          type="button"
          class="transition-colors {filterTabClass(selectedFilterId === f.id)}"
          aria-pressed={selectedFilterId === f.id}
          onclick={() => toggleFilterSelect(f.id)}
        >
          {f.name}
        </button>
      {/each}
      <button
        type="button"
        class="transition-colors {filterTabClass(
          selectedFilterId === UNMATCHED_FILTER_ID,
        )}"
        aria-pressed={selectedFilterId === UNMATCHED_FILTER_ID}
        onclick={() => toggleFilterSelect(UNMATCHED_FILTER_ID)}
      >
        {t("items.filterUnmatched")}
      </button>
    </div>
  {/if}
  <div class="flex shrink-0 items-center gap-4">
    <MarkAllReadButton onMarkAllRead={() => markAllRead()} />
    <div
      class="flex gap-3 text-xs"
      role="group"
      aria-label={t("items.filterBy")}
    >
      <button
        type="button"
        class="transition-colors {filter === 'unread'
          ? 'text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
        aria-pressed={filter === "unread"}
        onclick={() => setReadFilter("unread")}
      >
        {t("items.filterUnread")}
      </button>
      <button
        type="button"
        class="transition-colors {filter === 'all'
          ? 'text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
        aria-pressed={filter === "all"}
        onclick={() => setReadFilter("all")}
      >
        {t("items.filterAll")}
      </button>
    </div>
  </div>
</div>

{#if error}
  <p class="py-6 text-sm text-red-500">{error}</p>
{:else if items.length === 0 && !loading}
  <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.noItems")}</p>
{:else}
  <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
    {#each items as item (item.id)}
      {@const filterDisplay = getItemFilterDisplay(item, filterNameById)}
      {@const contentPreview = getMatchedContentPreview(
        item.content,
        filterDisplay.keywords,
      )}
      <li class="py-5">
        <article>
          <div
            class="flex items-baseline gap-1.5 text-xs text-neutral-400 dark:text-neutral-500"
          >
            <time datetime={item.published_at}>
              {formatTime(item.published_at, now)}
            </time>
            <span class="text-neutral-300 dark:text-neutral-600" aria-hidden="true"
              >·</span
            >
            <span>{item.feed_title}</span>
          </div>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onclick={() => handleOpenItem(item)}
            class="mt-1 block text-sm leading-snug hover:text-neutral-600 dark:hover:text-neutral-300 {item.is_read
              ? 'font-normal text-neutral-500 dark:text-neutral-500'
              : 'font-medium text-neutral-900 dark:text-neutral-100'}"
          >
            <HighlightedText text={item.title} keywords={filterDisplay.keywords} />
          </a>
          {#if contentPreview}
            <p
              class="mt-2 line-clamp-2 text-sm text-neutral-400 dark:text-neutral-500"
            >
              <HighlightedText
                text={contentPreview}
                keywords={filterDisplay.keywords}
              />
            </p>
          {/if}
          {#if filterDisplay.passedFilters.length > 0}
            <div
              class="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500"
            >
              {#each filterDisplay.passedFilters as entry, index (entry.id)}
                {@const name = filterNameById.get(entry.id) ?? entry.id}
                {@const keywords = parseMatchedKeywords(entry.keywords)}
                {@const reason = entry.reason?.trim() || null}
                {#if index > 0}<span>, </span>{/if}
                {#if keywords.length > 0 || reason}
                  <span
                    class="group/filter relative inline cursor-help underline decoration-dotted decoration-neutral-300 underline-offset-2 dark:decoration-neutral-600"
                    tabindex="0"
                  >
                    {name}
                    <span role="tooltip" class={filterTooltipClass}>
                      {#if keywords.length > 0}
                        <span
                          class="block font-medium text-neutral-700 dark:text-neutral-200"
                        >
                          {t("items.matchedKeywords")}
                        </span>
                        <span>{keywords.join(", ")}</span>
                      {/if}
                      {#if reason}
                        <span
                          class="block font-medium text-neutral-700 dark:text-neutral-200 {keywords.length >
                          0
                            ? 'mt-1'
                            : ''}"
                        >
                          {t("items.passReason")}
                        </span>
                        <span>{reason}</span>
                      {/if}
                    </span>
                  </span>
                {:else}
                  <span>{name}</span>
                {/if}
              {/each}
            </div>
          {:else if filterDisplay.aiReason}
            <p
              class="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500"
            >
              {filterDisplay.aiReason}
            </p>
          {/if}
        </article>
      </li>
    {/each}
  </ul>
{/if}

{#if loading}
  <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600">
    {t("items.loading")}
  </p>
{:else if !hasMore && items.length > 0}
  <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600">
    {t("items.noMore")}
  </p>
{/if}

<div bind:this={sentinel} class="h-1" aria-hidden="true"></div>
