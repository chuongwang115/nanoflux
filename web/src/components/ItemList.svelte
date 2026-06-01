<script lang="ts">
  import { onMount } from "svelte";
  import { t, tf } from "../lib/locale.svelte";
  import { subscribeItemStream } from "../lib/item-stream";
  import {
    fetchItemsPage,
    markAllItemsRead,
    markItemRead,
    type Item,
  } from "../lib/api";
  import {
    getItemFilterDisplay,
    getMatchedContentPreview,
  } from "../lib/highlight";
  import { formatTime } from "../lib/utils";
  import Lightbulb from "@lucide/svelte/icons/lightbulb";
  import LightbulbOff from "@lucide/svelte/icons/lightbulb-off";
  import HighlightedText from "./HighlightedText.svelte";
  import MarkAllReadButton from "./buttons/MarkAllReadButton.svelte";

  const passReasonIconProps = {
    size: 14,
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };

  const PAGE_SIZE = 20;
  /** Cap in-memory list after SSE inserts to avoid DOM bloat. */
  const MAX_LIST_ITEMS = 100;

  type ItemFilter = "passed" | "failed" | "unread";

  let items = $state<Item[]>([]);
  let cursor = $state<string | null>(null);
  let hasMore = $state(true);
  let loading = $state(false);
  let error = $state("");
  let sentinel = $state<HTMLDivElement | null>(null);
  let filter = $state<ItemFilter>("unread");
  let loadGeneration = 0;
  /** Bumps every minute so relative timestamps (e.g. "18 min ago") stay current. */
  let now = $state(Date.now());

  const filterPassed = $derived(filter === "failed" ? 0 : 1);
  const filterIsRead = $derived(filter === "unread" ? (0 as const) : undefined);

  function resetList() {
    items = [];
    cursor = null;
    hasMore = true;
    error = "";
    loading = false;
  }

  async function loadMore() {
    if (loading || !hasMore) return;
    const gen = ++loadGeneration;
    loading = true;
    error = "";

    try {
      const page = await fetchItemsPage(
        cursor ?? undefined,
        PAGE_SIZE,
        filterPassed,
        filterIsRead,
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

  async function setFilter(next: ItemFilter) {
    if (next === filter) return;
    filter = next;
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

  function compareItem(a: Item, b: Item): number {
    const cmp = b.published_at.localeCompare(a.published_at);
    if (cmp !== 0) return cmp;
    return b.id.localeCompare(a.id);
  }

  function mergeIncomingItem(incoming: Item[]) {
    if (!incoming.length) return;
    const seen = new Set(items.map((n) => n.id));
    const fresh = incoming.filter((n) => {
      if (seen.has(n.id)) return false;
      if (filter === "failed") return n.filter_passed === false;
      if (filter === "unread")
        return n.filter_passed === true && !n.is_read;
      return n.filter_passed === true;
    });
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
    await markAllItemsRead(until);
    if (filter === "unread") {
      items = items.filter((item) => item.published_at > until);
    } else {
      items = items.map((item) =>
        item.published_at <= until ? { ...item, is_read: true } : item,
      );
    }
  }

  onMount(() => {
    void loadMore();
    const unsubscribe = subscribeItemStream(mergeIncomingItem);
    const timer = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  });
</script>

<div class="mb-6 flex items-center justify-end gap-4">
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
      onclick={() => setFilter("unread")}
    >
      {t("items.filterUnread")}
    </button>
    <button
      type="button"
      class="transition-colors {filter === 'passed'
        ? 'text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
      aria-pressed={filter === "passed"}
      onclick={() => setFilter("passed")}
    >
      {t("items.filterPassed")}
    </button>
    <button
      type="button"
      class="transition-colors {filter === 'failed'
        ? 'text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
      aria-pressed={filter === "failed"}
      onclick={() => setFilter("failed")}
    >
      {t("items.filterFailed")}
    </button>
  </div>
</div>

{#if error}
  <p class="py-6 text-sm text-red-500">{error}</p>
{:else if items.length === 0 && !loading}
  <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.noItems")}</p>
{:else}
  <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
    {#each items as item (item.id)}
      {@const filterDisplay = getItemFilterDisplay(item)}
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
          {#if filterDisplay.keywordsText}
            <div
              class="mt-1.5 flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500"
            >
              <span>
                {tf("items.matchedKeywords", {
                  keywords: filterDisplay.keywordsText,
                })}
              </span>
              {#if filterDisplay.aiReason}
                <div class="group/preason relative shrink-0">
                  <button
                    type="button"
                    class="inline-flex cursor-help items-center justify-center rounded-sm p-0.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    aria-label={filterDisplay.aiReason}
                  >
                    {#if item.filter_passed}
                      <Lightbulb {...passReasonIconProps} />
                    {:else}
                      <LightbulbOff {...passReasonIconProps} />
                    {/if}
                  </button>
                  <div
                    role="tooltip"
                    class="pointer-events-none absolute bottom-full left-0 z-20 mb-1 w-max max-w-xs rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs leading-snug whitespace-normal text-neutral-600 opacity-0 shadow-sm transition-opacity group-hover/preason:opacity-100 group-focus-within/preason:opacity-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 [@media(hover:none)]:opacity-100"
                  >
                    {filterDisplay.aiReason}
                  </div>
                </div>
              {/if}
            </div>
          {:else if filterDisplay.aiReason}
            <p class="mt-1.5 text-xs text-neutral-400 dark:text-neutral-500">
              {tf("items.passReason", { reason: filterDisplay.aiReason })}
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
