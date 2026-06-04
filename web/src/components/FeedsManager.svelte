<script lang="ts">
  import { onMount } from "svelte";
  import Download from "@lucide/svelte/icons/download";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import {
    createFeed,
    deleteFeed,
    downloadFeedsOpml,
    fetchFeedsPage,
    previewFeed,
    updateFeed,
    type Feed,
    type FeedSort,
  } from "../lib/api";
  import { t } from "../lib/locale.svelte";
  import { formatTime } from "../lib/utils";

  const PAGE_SIZE = 20;
  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true as const };

  let feeds = $state<Feed[]>([]);
  let cursor = $state<string | null>(null);
  let hasMore = $state(true);
  let editId = $state<string | null>(null);
  let title = $state("");
  let url = $state("");
  let description = $state("");
  let formError = $state("");
  let listError = $state("");
  let loading = $state(true);
  let loadingMore = $state(false);
  let previewing = $state(false);
  let previewError = $state("");
  let titleTouched = $state(false);
  let descriptionTouched = $state(false);
  let previewTimer: ReturnType<typeof setTimeout> | undefined;
  let previewRequest = 0;
  let sentinel = $state<HTMLDivElement | null>(null);
  let sort = $state<FeedSort>("updated_desc");
  let exportingOpml = $state(false);
  /** Bumps every minute so relative timestamps stay current. */
  let now = $state(Date.now());

  const isEditing = $derived(editId !== null);

  function isValidFeedUrl(value: string): boolean {
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function cancelPreview() {
    previewRequest++;
    previewing = false;
    clearTimeout(previewTimer);
  }

  async function runPreview(feedUrl: string) {
    const trimmed = feedUrl.trim();
    if (!isValidFeedUrl(trimmed)) {
      cancelPreview();
      return;
    }

    const requestId = ++previewRequest;
    previewing = true;
    previewError = "";
    try {
      const res = await previewFeed(trimmed);
      if (requestId !== previewRequest) return;
      if (!titleTouched && res.data.title) title = res.data.title;
      if (!descriptionTouched && res.data.description)
        description = res.data.description;
    } catch (e) {
      if (requestId !== previewRequest) return;
      previewError = e instanceof Error ? e.message : t("feeds.parseFailed");
    } finally {
      if (requestId === previewRequest) previewing = false;
    }
  }

  function schedulePreview() {
    clearTimeout(previewTimer);
    previewError = "";
    const feedUrl = url.trim();
    if (!isValidFeedUrl(feedUrl)) {
      cancelPreview();
      return;
    }
    previewTimer = setTimeout(() => void runPreview(feedUrl), 600);
  }

  function onUrlInput() {
    schedulePreview();
  }

  function onUrlBlur() {
    clearTimeout(previewTimer);
    const feedUrl = url.trim();
    if (!isValidFeedUrl(feedUrl)) {
      cancelPreview();
      return;
    }
    void runPreview(feedUrl);
  }

  async function loadFeeds(append = false) {
    listError = "";
    if (append) {
      if (loadingMore || !hasMore) return;
      loadingMore = true;
    } else {
      loading = true;
      cursor = null;
      hasMore = true;
    }

    try {
      const page = await fetchFeedsPage(
        append ? (cursor ?? undefined) : undefined,
        PAGE_SIZE,
        undefined,
        sort,
      );
      feeds = append ? [...feeds, ...page.data] : page.data;
      cursor = page.nextCursor;
      hasMore = page.hasMore;
    } catch (e) {
      listError = e instanceof Error ? e.message : t("feeds.loadFailed");
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  async function loadMore() {
    await loadFeeds(true);
  }

  $effect(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  function resetForm() {
    editId = null;
    title = "";
    url = "";
    description = "";
    formError = "";
    previewError = "";
    titleTouched = false;
    descriptionTouched = false;
    cancelPreview();
  }

  function startEdit(feed: Feed) {
    editId = feed.id;
    title = feed.title;
    url = feed.url;
    description = feed.description ?? "";
    formError = "";
    previewError = "";
    titleTouched = true;
    descriptionTouched = true;
    cancelPreview();
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    formError = "";

    try {
      if (editId !== null) {
        await updateFeed(editId, {
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || null,
        });
      } else {
        await createFeed({
          title: title.trim(),
          url: url.trim(),
          description: description.trim() || null,
        });
      }
      resetForm();
      loading = true;
      await loadFeeds();
    } catch (err) {
      formError = err instanceof Error ? err.message : t("feeds.saveFailed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("feeds.confirmDelete"))) return;
    listError = "";
    try {
      await deleteFeed(id);
      if (editId === id) resetForm();
      loading = true;
      await loadFeeds();
    } catch (e) {
      listError = e instanceof Error ? e.message : t("feeds.deleteFailed");
    }
  }

  async function setSort(next: FeedSort) {
    if (next === sort) return;
    sort = next;
    loading = true;
    await loadFeeds();
  }

  async function handleExportOpml() {
    if (exportingOpml) return;
    listError = "";
    exportingOpml = true;
    try {
      await downloadFeedsOpml();
    } catch (e) {
      listError = e instanceof Error ? e.message : t("feeds.exportOpmlFailed");
    } finally {
      exportingOpml = false;
    }
  }

  onMount(() => {
    void loadFeeds();
    const timer = setInterval(() => {
      now = Date.now();
    }, 60_000);
    return () => clearInterval(timer);
  });
</script>

<section class="mb-10">
  <form class="space-y-3" onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={title}
      oninput={() => (titleTouched = true)}
      required
      placeholder={t("feeds.name")}
      class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"
    />
    <input
      type="url"
      bind:value={url}
      oninput={onUrlInput}
      onblur={onUrlBlur}
      required
      readonly={isEditing}
      placeholder="https://example.com/feed.xml"
      class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"
      class:cursor-not-allowed={isEditing}
      class:text-neutral-400={isEditing}
      class:dark:text-neutral-500={isEditing}
    />
    <input
      type="text"
      bind:value={description}
      oninput={() => (descriptionTouched = true)}
      placeholder={t("feeds.descriptionOptional")}
      class="w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100"
    />
    <div class="flex gap-4 pt-2">
      <button
        type="submit"
        class="text-sm text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
      >
        {isEditing ? t("feeds.save") : t("feeds.addFeed")}
      </button>
      {#if isEditing}
        <button
          type="button"
          class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          onclick={resetForm}
        >
          {t("feeds.cancel")}
        </button>
      {/if}
    </div>
  </form>
  {#if previewing}
    <p class="mt-3 text-sm text-neutral-400 dark:text-neutral-500">
      {t("feeds.parsing")}
    </p>
  {:else if previewError}
    <p class="mt-3 text-sm text-amber-600 dark:text-amber-500">
      {previewError}
    </p>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>

<section>
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <h2
      class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
    >
      {t("feeds.feedList")}
    </h2>
    <div class="flex flex-wrap items-center gap-3 text-xs">
      <button
        type="button"
        class="inline-flex items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-600 disabled:opacity-50 dark:hover:text-neutral-300"
        disabled={exportingOpml}
        aria-label={t("feeds.exportOpml")}
        title={t("feeds.exportOpml")}
        onclick={() => void handleExportOpml()}
      >
        <Download {...iconProps} />
        {exportingOpml ? t("feeds.exportingOpml") : t("feeds.exportOpml")}
      </button>
      <div
        class="flex gap-3"
        role="group"
        aria-label={t("feeds.sortBy")}
      >
      <button
        type="button"
        class="transition-colors {sort === 'updated_desc'
          ? 'text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
        aria-pressed={sort === "updated_desc"}
        onclick={() => setSort("updated_desc")}
      >
        {t("feeds.sortDefault")}
      </button>
      <button
        type="button"
        class="transition-colors {sort === 'published_desc'
          ? 'text-neutral-900 dark:text-neutral-100'
          : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'}"
        aria-pressed={sort === "published_desc"}
        onclick={() => setSort("published_desc")}
      >
        {t("feeds.sortByPublished")}
      </button>
      </div>
    </div>
  </div>
  {#if listError}
    <p class="text-sm text-red-500">{listError}</p>
  {:else if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else if feeds.length === 0}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("feeds.noFeeds")}</p>
  {:else}
    <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
      {#each feeds as feed (feed.id)}
        <li class="group grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5">
            <p class="min-w-0 text-sm font-medium">{feed.title}</p>
            <div class="relative flex shrink-0 items-center">
              <div
                class="absolute right-full mr-2 flex gap-1 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 dark:text-neutral-500"
              >
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1 hover:text-neutral-900 dark:hover:text-neutral-100"
                  aria-label={t("feeds.edit")}
                  title={t("feeds.edit")}
                  onclick={() => startEdit(feed)}
                >
                  <Pencil {...iconProps} />
                </button>
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1 hover:text-red-500"
                  aria-label={t("feeds.delete")}
                  title={t("feeds.delete")}
                  onclick={() => handleDelete(feed.id)}
                >
                  <Trash2 {...iconProps} />
                </button>
              </div>
              <time
                datetime={feed.last_published_at ?? undefined}
                class="text-xs text-neutral-400 dark:text-neutral-500"
                title={t("feeds.lastPublished")}
              >
                {#if feed.last_published_at}
                  {formatTime(feed.last_published_at, now)}
                {:else}
                  {t("feeds.noPublished")}
                {/if}
              </time>
            </div>
            <a
              href={feed.url}
              target="_blank"
              rel="noopener noreferrer"
              class="col-span-2 min-w-0 w-full truncate text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              {feed.url}
            </a>
            {#if feed.description}
              <p
                class="col-span-2 text-sm text-neutral-400 dark:text-neutral-500"
              >
                {feed.description}
              </p>
            {/if}
        </li>
      {/each}
    </ul>
    {#if loadingMore}
      <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600">
        {t("feeds.loading")}
      </p>
    {:else if !hasMore && feeds.length > 0}
      <p class="py-8 text-center text-sm text-neutral-300 dark:text-neutral-600">
        {t("feeds.noMore")}
      </p>
    {/if}
    <div bind:this={sentinel} class="h-1" aria-hidden="true"></div>
  {/if}
</section>
