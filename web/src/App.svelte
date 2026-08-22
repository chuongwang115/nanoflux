<script lang="ts">
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import FiltersManager from "./components/FiltersManager.svelte";
  import ExportPage from "./components/ExportPage.svelte";
  import FeverManager from "./components/FeverManager.svelte";
  import NewsList from "./components/ItemList.svelte";
  import { route } from "./lib/router";
</script>

<main class="w-full font-sans md:flex">
  <Header />
  <div class="min-w-0 flex-1">
    <div class="mx-auto max-w-page px-5 py-10 md:py-16">
      {#if $route === "/feeds"}
        <FeedsManager />
      {:else if $route === "/filter"}
        <FiltersManager />
      {:else if $route === "/export"}
        <ExportPage />
      {:else if $route === "/fever"}
        <FeverManager />
      {:else}
        <NewsList />
      {/if}
    </div>
  </div>
</main>
