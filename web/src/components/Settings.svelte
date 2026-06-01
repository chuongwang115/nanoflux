<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { fetchSettings, saveSettings } from "../lib/api";
  import { t } from "../lib/locale.svelte";
  import { normalizeCommas } from "../lib/utils";
  import {
    SETTINGS_SAVE_KEY,
    type SettingsSaveHost,
  } from "../lib/settings-save";

  const settingsSaveHost = getContext<SettingsSaveHost>(SETTINGS_SAVE_KEY);

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass =
    "min-h-48 resize-y " + inputClass;

  let whitelist = $state("");
  let blacklist = $state("");
  let prompt = $state("");
  let loading = $state(true);
  let loaded = $state(false);
  let loadError = $state("");
  let saveError = $state("");

  async function load() {
    loading = true;
    loadError = "";
    try {
      const data = await fetchSettings();
      whitelist = data.whitelist;
      blacklist = data.blacklist;
      prompt = data.prompt;
      loaded = true;
    } catch (e) {
      loadError = e instanceof Error ? e.message : t("settings.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function persist() {
    if (!loaded || loading) return;
    saveError = "";
    try {
      whitelist = normalizeCommas(whitelist);
      blacklist = normalizeCommas(blacklist);
      const data = await saveSettings({ whitelist, blacklist, prompt });
      whitelist = data.whitelist;
      blacklist = data.blacklist;
      prompt = data.prompt;
    } catch (e) {
      saveError = e instanceof Error ? e.message : t("settings.saveFailed");
      throw e;
    }
  }

  onMount(() => {
    settingsSaveHost.register(persist);
    void load();
    return () => settingsSaveHost.register(undefined);
  });
</script>

<section>
  <h2
    class="mb-6 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
  >
    {t("settings.title")}
  </h2>

  {#if loading}
    <p class="text-sm text-neutral-400 dark:text-neutral-500">
      {t("settings.loading")}
    </p>
  {:else if loadError}
    <p class="text-sm text-red-500">{loadError}</p>
  {:else}
    <div class="space-y-6">
      <div class="space-y-1">
        <label
          for="whitelist"
          class="text-sm text-neutral-600 dark:text-neutral-400"
        >
          {t("settings.whitelist")}
        </label>
        <input
          id="whitelist"
          type="text"
          bind:value={whitelist}
          placeholder={t("settings.whitelistHint")}
          class={inputClass}
        />
        <p class="text-xs text-neutral-400 dark:text-neutral-500">
          {t("settings.whitelistHint")}
        </p>
      </div>
      <div class="space-y-1">
        <label
          for="blacklist"
          class="text-sm text-neutral-600 dark:text-neutral-400"
        >
          {t("settings.blacklist")}
        </label>
        <input
          id="blacklist"
          type="text"
          bind:value={blacklist}
          placeholder={t("settings.blacklistHint")}
          class={inputClass}
        />
        <p class="text-xs text-neutral-400 dark:text-neutral-500">
          {t("settings.blacklistHint")}
        </p>
      </div>
      <div class="space-y-1">
        <label
          for="prompt"
          class="text-sm text-neutral-600 dark:text-neutral-400"
        >
          {t("settings.prompt")}
        </label>
        <textarea
          id="prompt"
          bind:value={prompt}
          placeholder={t("settings.promptHint")}
          class={textareaClass}
        ></textarea>
        <p class="text-xs text-neutral-400 dark:text-neutral-500">
          {t("settings.promptHint")}
        </p>
      </div>
    </div>
    {#if saveError}
      <p class="mt-3 text-sm text-red-500">{saveError}</p>
    {/if}
  {/if}
</section>
