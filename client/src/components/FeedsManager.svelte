<script lang="ts">
  import { onMount } from "svelte";
  import {
    createFeed,
    deleteFeed,
    fetchFeeds,
    previewFeed,
    updateFeed,
    type Feed,
  } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  let feeds = $state<Feed[]>([]);
  let editId = $state<string | null>(null);
  let title = $state("");
  let url = $state("");
  let description = $state("");
  let formError = $state("");
  let listError = $state("");
  let loading = $state(true);
  let previewing = $state(false);
  let previewError = $state("");
  let titleTouched = $state(false);
  let descriptionTouched = $state(false);
  let previewTimer: ReturnType<typeof setTimeout> | undefined;
  let previewRequest = 0;

  const isEditing = $derived(editId !== null);

  function isValidFeedUrl(value: string): boolean {
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function runPreview(feedUrl: string) {
    const requestId = ++previewRequest;
    previewing = true;
    previewError = "";
    try {
      const res = await previewFeed(feedUrl);
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
    if (!isValidFeedUrl(feedUrl)) return;
    previewTimer = setTimeout(() => void runPreview(feedUrl), 600);
  }

  function onUrlInput() {
    previewRequest++;
    previewing = false;
    schedulePreview();
  }

  function onUrlBlur() {
    clearTimeout(previewTimer);
    const feedUrl = url.trim();
    if (isValidFeedUrl(feedUrl)) void runPreview(feedUrl);
  }

  async function loadFeeds() {
    listError = "";
    try {
      const res = await fetchFeeds();
      feeds = res.data;
    } catch (e) {
      listError = e instanceof Error ? e.message : t("feeds.loadFailed");
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    editId = null;
    title = "";
    url = "";
    description = "";
    formError = "";
    previewError = "";
    titleTouched = false;
    descriptionTouched = false;
    previewRequest++;
    clearTimeout(previewTimer);
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
    previewRequest++;
    clearTimeout(previewTimer);
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    formError = "";

    try {
      if (editId !== null) {
        await updateFeed(editId, {
          title: title.trim(),
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
      await loadFeeds();
    } catch (e) {
      listError = e instanceof Error ? e.message : t("feeds.deleteFailed");
    }
  }

  onMount(loadFeeds);
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
  <h2
    class="mb-4 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
  >
    {t("feeds.feedList")}
  </h2>
  {#if listError}
    <p class="text-sm text-red-500">{listError}</p>
  {:else if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else if feeds.length === 0}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("feeds.noFeeds")}</p>
  {:else}
    <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
      {#each feeds as feed (feed.id)}
        <li class="py-5">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium">{feed.title}</p>
              <a
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-0.5 block truncate text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                {feed.url}
              </a>
              {#if feed.description}
                <p class="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                  {feed.description}
                </p>
              {/if}
            </div>
            <div
              class="flex shrink-0 gap-3 text-xs text-neutral-400 dark:text-neutral-500"
            >
              <button
                type="button"
                class="hover:text-neutral-900 dark:hover:text-neutral-100"
                onclick={() => startEdit(feed)}
              >
                {t("feeds.edit")}
              </button>
              <button
                type="button"
                class="hover:text-red-500"
                onclick={() => handleDelete(feed.id)}
              >
                {t("feeds.delete")}
              </button>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
