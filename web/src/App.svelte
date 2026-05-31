<script lang="ts">
  import { setContext } from "svelte";
  import Header from "./components/Header.svelte";
  import FeedsManager from "./components/FeedsManager.svelte";
  import NewsList from "./components/ItemList.svelte";
  import Settings from "./components/Settings.svelte";
  import {
    SETTINGS_SAVE_KEY,
    createSettingsSaveHost,
  } from "./lib/settings-save";
  import { route } from "./lib/router";

  const settingsSaveHost = createSettingsSaveHost();
  setContext(SETTINGS_SAVE_KEY, settingsSaveHost);
</script>

<main class="mx-auto max-w-page px-5 py-16 font-sans">
  <Header />
  {#if $route === "/feeds"}
    <FeedsManager />
  {:else if $route === "/settings"}
    <Settings />
  {:else}
    <NewsList />
  {/if}
</main>
