<script lang="ts">
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import FiltersManager from "./components/FiltersManager.svelte";
  import NewsList from "./components/ItemList.svelte";
  import { route } from "./lib/router";
</script>

<main class="mx-auto max-w-page px-5 py-16 font-sans">
  <Header />
  {#if $route === "/feeds"}
    <FeedsManager />
  {:else if $route === "/filters"}
    <FiltersManager />
  {:else}
    <NewsList />
  {/if}
</main>
