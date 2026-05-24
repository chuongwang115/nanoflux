<script lang="ts">
  import { setContext } from "svelte";
  import Router from "svelte-spa-router";
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import NewsList from "./components/ItemList.svelte";
  import {
    MARK_ALL_READ_KEY,
    createMarkAllReadHost,
  } from "./lib/mark-all-read";

  const routes = {
    "/": NewsList,
    "/feeds": FeedsManager,
  };

  const markAllReadHost = createMarkAllReadHost();
  setContext(MARK_ALL_READ_KEY, markAllReadHost);
</script>

<main class="mx-auto max-w-page px-6 py-16 font-sans">
  <Header />
  <Router {routes} restoreScrollState />
</main>
