<script lang="ts">
  import { onMount } from "svelte";
  import { fetchFilter, updateFilter } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;

  let prompt = $state("");
  let enabled = $state(false);
  let keywords = $state("");
  let sources = $state<string[]>([]);
  let sourceInput = $state("");
  let savedPrompt = $state("");
  let savedEnabled = $state(false);
  let savedKeywords = $state("");
  let savedSources = $state<string[]>([]);
  let formError = $state("");
  let loading = $state(true);
  let saving = $state(false);

  const isDirty = $derived(
    prompt.trim() !== savedPrompt ||
      enabled !== savedEnabled ||
      keywords.trim() !== savedKeywords ||
      sources.join("\u0000") !== savedSources.join("\u0000"),
  );
  const saveDisabled = $derived(saving || loading || !isDirty);

  function toggleClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  async function loadFilter() {
    formError = "";
    loading = true;
    try {
      const filter = await fetchFilter();
      prompt = filter.prompt;
      enabled = filter.enabled;
      keywords = filter.keywords;
      sources = filter.sources;
      savedPrompt = filter.prompt;
      savedEnabled = filter.enabled;
      savedKeywords = filter.keywords;
      savedSources = filter.sources;
    } catch (e) {
      formError = e instanceof Error ? e.message : t("filters.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (saveDisabled) return;
    formError = "";
    saving = true;

    try {
      const updated = await updateFilter({
        prompt: prompt.trim(),
        enabled,
        keywords: keywords.trim(),
        sources,
      });
      prompt = updated.prompt;
      enabled = updated.enabled;
      savedPrompt = updated.prompt;
      savedEnabled = updated.enabled;
      keywords = updated.keywords;
      savedKeywords = updated.keywords;
      sources = updated.sources;
      savedSources = updated.sources;
    } catch (err) {
      formError = err instanceof Error ? err.message : t("filters.saveFailed");
    } finally {
      saving = false;
    }
  }

  function addSource(): void {
    const candidates = sourceInput
      .split(/[,，\s]+/)
      .map((source) => source.trim().toLocaleLowerCase().replace(/^https?:\/\//, "").split("/")[0]?.replace(/^www\./, "") ?? "")
      .filter(Boolean);
    if (candidates.length) {
      sources = [...new Set([...sources, ...candidates])];
    }
    sourceInput = "";
  }

  function removeSource(source: string): void {
    sources = sources.filter((item) => item !== source);
  }

  function handleSourceKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSource();
    }
    if (event.key === "Backspace" && !sourceInput && sources.length) {
      sources = sources.slice(0, -1);
    }
  }

  onMount(() => {
    void loadFilter();
  });
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">
    {t("filters.hint")}
  </p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("filters.enabled")}
        </span>
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          role="group"
          aria-label={t("filters.enabled")}
        >
          <button
            type="button"
            class="transition-colors {toggleClass(enabled)}"
            aria-pressed={enabled}
            disabled={saving}
            onclick={() => (enabled = true)}
          >
            {t("filters.on")}
          </button>
          <button
            type="button"
            class="transition-colors {toggleClass(!enabled)}"
            aria-pressed={!enabled}
            disabled={saving}
            onclick={() => (enabled = false)}
          >
            {t("filters.off")}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("filters.sources")}
        </span>
        <div class="flex min-h-11 flex-wrap items-center gap-2 border-b border-neutral-200 py-2 focus-within:border-neutral-900 dark:border-neutral-700 dark:focus-within:border-neutral-100">
          {#each sources as source}
            <span class="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
              {source}
              <button
                type="button"
                class="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                aria-label={`${t("filters.removeSource")} ${source}`}
                disabled={saving}
                onclick={() => removeSource(source)}
              >×</button>
            </span>
          {/each}
          <input
            bind:value={sourceInput}
            class="min-w-40 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
            disabled={saving}
            placeholder={t("filters.sourcesPlaceholder")}
            onkeydown={handleSourceKeydown}
            onblur={addSource}
          />
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("filters.keywords")}
        </span>
        <textarea
          bind:value={keywords}
          class="min-h-32 resize-y {inputClass}"
          disabled={saving}
          placeholder={t("filters.keywordsPlaceholder")}
        ></textarea>
      </label>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("filters.prompt")}
        </span>
        <textarea bind:value={prompt} class={textareaClass} disabled={saving}></textarea>
      </label>

      <button
        type="button"
        disabled={saveDisabled}
        class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
        onclick={() => void handleSave()}
      >
        {saving ? t("filters.saving") : t("filters.save")}
      </button>
    </div>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>
