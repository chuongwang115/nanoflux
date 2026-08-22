<script lang="ts">
  import {
    exportHref,
    feedsHref,
    feverHref,
    filterHref,
    homeHref,
    navClick,
    route,
  } from "../lib/router";
  import FontSizeToggle from "./buttons/FontSizeToggle.svelte";
  import LanguageToggle from "./buttons/LanguageToggle.svelte";
  import ThemeToggle from "./buttons/ThemeToggle.svelte";
  import { t } from "../lib/locale.svelte";

  const navClass = (active: boolean) =>
    `block rounded-md px-2 py-1.5 transition-colors ${
      active
        ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
        : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
    }`;
</script>

<aside
  class="border-b border-neutral-100 px-5 py-5 dark:border-neutral-800 md:sticky md:top-4 md:m-4 md:flex md:h-[calc(100vh-2rem)] md:w-48 md:shrink-0 md:flex-col md:rounded-xl md:border md:bg-white md:px-5 md:py-8 md:shadow-sm md:dark:bg-neutral-950"
>
  <a
    href={homeHref()}
    onclick={navClick("/")}
    class="text-lg font-medium tracking-tight hover:opacity-70"
  >
    NanoFlux
  </a>

  <nav
    class="mt-4 flex min-w-0 gap-1 overflow-x-auto text-sm md:mt-8 md:flex-col md:overflow-visible"
    aria-label={t("items.latest")}
  >
    <a
      href={homeHref()}
      onclick={navClick("/")}
      class={navClass($route === "/")}
      aria-current={$route === "/" ? "page" : undefined}
    >
      {t("items.latest")}
    </a>
    <a
      href={feedsHref()}
      onclick={navClick("/feeds")}
      class={navClass($route === "/feeds")}
      aria-current={$route === "/feeds" ? "page" : undefined}
    >
      {t("items.feeds")}
    </a>
    <a
      href={filterHref()}
      onclick={navClick("/filter")}
      class={navClass($route === "/filter")}
      aria-current={$route === "/filter" ? "page" : undefined}
    >
      {t("items.filter")}
    </a>
    <a
      href={feverHref()}
      onclick={navClick("/fever")}
      class={navClass($route === "/fever")}
      aria-current={$route === "/fever" ? "page" : undefined}
    >
      {t("items.fever")}
    </a>
    <a
      href={exportHref()}
      onclick={navClick("/export")}
      class={navClass($route === "/export")}
      aria-current={$route === "/export" ? "page" : undefined}
    >
      {t("items.export")}
    </a>
  </nav>

  <div class="mt-4 flex shrink-0 items-center gap-0.5 md:mt-auto">
    <FontSizeToggle />
    <LanguageToggle />
    <ThemeToggle />
  </div>
</aside>
