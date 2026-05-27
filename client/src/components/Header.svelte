<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { navClick, navClickParent, parentHref, route } from "../lib/router";
  import FontSizeToggle from "./buttons/FontSizeToggle.svelte";
  import MarkAllReadButton from "./buttons/MarkAllReadButton.svelte";
  import LanguageToggle from "./buttons/LanguageToggle.svelte";
  import ThemeToggle from "./buttons/ThemeToggle.svelte";
  import { t } from "../lib/locale.svelte";
  import { MARK_ALL_READ_KEY, type MarkAllReadHost } from "../lib/mark-all-read";

  /** Enter compact below this; exit above the lower value to avoid threshold flicker. */
  const COMPACT_ENTER = 72;
  const COMPACT_EXIT = 8;

  const markAllReadHost = getContext<MarkAllReadHost>(MARK_ALL_READ_KEY);

  function readCompact(scrollY: number, current: boolean): boolean {
    if (!current && scrollY > COMPACT_ENTER) return true;
    if (current && scrollY < COMPACT_EXIT) return false;
    return current;
  }

  function initialCompact(): boolean {
    return typeof window !== "undefined" && window.scrollY > COMPACT_ENTER;
  }

  let compact = $state(initialCompact());

  const isFeeds = $derived($route === "/feeds");

  const rowClass = $derived(
    `transition-[gap] duration-300 ${compact ? "flex min-w-0 items-center justify-between gap-4" : ""}`,
  );

  const subClass = $derived(
    `flex min-h-[30px] min-w-0 items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 ${compact ? "shrink-0" : "mt-1"}`,
  );

  const titleClass = "shrink-0 text-lg font-medium tracking-tight";

  function syncCompact() {
    compact = readCompact(window.scrollY, compact);
  }

  onMount(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      syncCompact();
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    syncCompact();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", update);
    };
  });

  $effect(() => {
    $route;
    requestAnimationFrame(() => syncCompact());
  });
</script>

<header
  class="sticky top-0 z-20 -mx-6 mb-10 flex justify-between gap-4 border-b px-6 transition-colors duration-200 ease-out
    {compact
      ? 'items-center border-neutral-100 bg-white py-3 dark:border-neutral-800 dark:bg-neutral-950'
      : 'items-start border-transparent bg-transparent py-0'}"
>
  <div class="min-w-0 flex-1">
    <div class={rowClass}>
      {#if isFeeds}
        <a href={parentHref()} onclick={navClickParent()} class="{titleClass} hover:opacity-70">NanoFlux</a>
      {:else}
        <h1 class={titleClass}>NanoFlux</h1>
      {/if}

      {#if isFeeds}
        <div class="{subClass} gap-3">
          <a
            href={parentHref()}
            onclick={navClickParent()}
            class="inline-flex shrink-0 rounded-md p-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            aria-label={t("feeds.back")}
            title={t("feeds.back")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </a>
          <p>{t("feeds.title")}</p>
        </div>
      {:else}
        <nav class={subClass} aria-label={t("items.latest")}>
          <span>{t("items.latest")}</span>
          <span class="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
          <a
            href="/feeds"
            onclick={navClick("/feeds")}
            class="hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {t("items.feeds")}
          </a>
        </nav>
      {/if}
    </div>
  </div>
  <div class="flex shrink-0 items-center gap-0.5">
    {#if isFeeds}
      <span
        class="inline-flex items-center justify-center rounded-md p-1.5 invisible pointer-events-none"
        aria-hidden="true"
      >
        <span class="size-[18px]"></span>
      </span>
    {:else}
      <MarkAllReadButton onMarkAllRead={() => markAllReadHost.markAllRead()} />
    {/if}
    <FontSizeToggle />
    <LanguageToggle />
    <ThemeToggle />
  </div>
</header>
