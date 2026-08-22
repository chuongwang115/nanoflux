<script lang="ts">
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import SettingsManager from "./components/SettingsManager.svelte";
  import ExportPage from "./components/ExportPage.svelte";
  import NewsList from "./components/ItemList.svelte";
  import { route } from "./lib/router";
</script>

<main class="w-full font-sans md:flex">
  <Header />
  {#if $route === "/settings"}
    <SettingsManager />
  {:else}
    <div class="min-w-0 flex-1">
      <div class="mx-auto max-w-page px-5 py-10 md:py-16">
        {#if $route === "/feeds"}
          <FeedsManager />
        {:else if $route === "/export"}
          <ExportPage />
        {:else}
          <NewsList />
        {/if}
      </div>
    </div>
  {/if}
</main>
