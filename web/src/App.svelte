<script lang="ts">
  import { setContext } from "svelte";
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import NewsList from "./components/ItemList.svelte";
  import {
    MARK_ALL_READ_KEY,
    createMarkAllReadHost,
  } from "./lib/mark-all-read";
  import { route } from "./lib/router";

  const markAllReadHost = createMarkAllReadHost();
  setContext(MARK_ALL_READ_KEY, markAllReadHost);
</script>

<main class="mx-auto max-w-page px-5 py-16 font-sans">
  <Header />
  {#if $route === "/feeds"}
    <FeedsManager />
  {:else}
    <NewsList />
  {/if}
</main>
