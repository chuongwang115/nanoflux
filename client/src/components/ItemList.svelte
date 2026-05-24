<script lang="ts">
  import { getContext } from "svelte";
  import { t } from "../lib/locale.svelte";
  import {
    fetchItemsPage,
    markAllItemsRead,
    markItemRead,
    type Item,
  } from "../lib/api";
  import { formatTime } from "../lib/utils";
  import {
    MARK_ALL_READ_KEY,
    type MarkAllReadHost,
  } from "../lib/mark-all-read";

  const markAllReadHost = getContext<MarkAllReadHost>(MARK_ALL_READ_KEY);

  const PAGE_SIZE = 20;

  let items = $state<Item[]>([]);
  let cursor = $state<string | null>(null);
  let hasMore = $state(true);
  let loading = $state(false);
  let error = $state("");
  let sentinel = $state<HTMLDivElement | null>(null);
  let started = $state(false);

  async function loadMore() {
    if (loading || !hasMore) return;
    loading = true;
    error = "";

    try {
      const page = await fetchItemsPage(cursor ?? undefined, PAGE_SIZE);
      items = [...items, ...page.data];
      cursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (e) {
      error = e instanceof Error ? e.message : t("items.loadFailed");
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (!started) {
      started = true;
      loadMore();
    }
  });

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
    const fresh = incoming.filter((n) => !seen.has(n.id));
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
    items = merged;
  }

  function handleOpenItem(item: Item) {
    if (item.is_read) return;
    items = items.map((n) =>
      n.id === item.id ? { ...n, is_read: true } : n,
    );
    void markItemRead(item.id).catch(() => {
      items = items.map((n) =>
        n.id === item.id ? { ...n, is_read: false } : n,
      );
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
    items = items.map((item) =>
      item.published_at <= until ? { ...item, is_read: true } : item,
    );
  }

  $effect(() => {
    markAllReadHost.register(markAllRead);
    return () => markAllReadHost.register(undefined);
  });

  $effect(() => {
    const es = new EventSource("/sse");

    es.addEventListener("items", (ev) => {
      try {
        mergeIncomingItem(JSON.parse(ev.data) as Item[]);
      } catch {
        /* ignore malformed payloads */
      }
    });

    return () => es.close();
  });
</script>

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
              {formatTime(item.published_at)}
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
          {#if item.description}
            <p
              class="mt-2 line-clamp-2 text-sm text-neutral-400 dark:text-neutral-500"
            >
              {item.description}
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
