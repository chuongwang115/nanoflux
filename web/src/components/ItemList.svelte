<script lang="ts">
  import { onMount } from "svelte";
  import { t } from "../lib/locale.svelte";
  import {
    fetchItemsPage,
    markAllItemsRead,
    markItemRead,
    type Item,
  } from "../lib/api";
  import { formatTime } from "../lib/utils";
  import MarkAllReadButton from "./buttons/MarkAllReadButton.svelte";

  const PAGE_SIZE = 20;

  type ItemFilter = "unread" | "all";

  let items = $state<Item[]>([]);
  let cursor = $state<string | null>(null);
  let hasMore = $state(true);
  let loading = $state(false);
  let error = $state("");
  let sentinel = $state<HTMLDivElement | null>(null);
  let filter = $state<ItemFilter>("unread");
  let loadGeneration = 0;
  /** Bumps every minute so relative timestamps stay current. */
  let now = $state(Date.now());

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

  async function setReadFilter(next: ItemFilter) {
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

    const timer = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => {
      clearInterval(timer);
    };
  });
</script>

<div class="mb-6 flex items-center justify-between gap-4">
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
  <MarkAllReadButton onMarkAllRead={() => markAllRead()} />
</div>

{#if error}
  <p class="py-6 text-sm text-red-500">{error}</p>
{:else if items.length === 0 && !loading}
  <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.noItems")}</p>
{:else}
  <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
    {#each items as item (item.id)}
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
            {item.title}
          </a>
          {#if item.content}
            <p
              class="mt-2 line-clamp-2 text-sm text-neutral-400 dark:text-neutral-500"
            >
              {item.content}
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
