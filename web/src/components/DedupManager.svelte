<script lang="ts">
  import { onMount } from "svelte";
  import { fetchDedup, updateDedup, type DedupConfig } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  const inputClass =
    "w-32 border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const labelClass =
    "block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500";
  const hintClass = "text-xs text-neutral-400 dark:text-neutral-500";

  let enabled = $state(true);
  let windowDays = $state(3);
  let minSimilarity = $state(0.6);
  let maxCandidates = $state(5);
  let saved = $state<DedupConfig | null>(null);
  let formError = $state("");
  let loading = $state(true);
  let saving = $state(false);

  const isValid = $derived(
    Number.isInteger(windowDays) &&
      windowDays >= 1 &&
      windowDays <= 30 &&
      Number.isFinite(minSimilarity) &&
      minSimilarity >= 0 &&
      minSimilarity <= 1 &&
      Number.isInteger(maxCandidates) &&
      maxCandidates >= 1 &&
      maxCandidates <= 20,
  );
  const isDirty = $derived(
    saved !== null &&
      (enabled !== saved.enabled ||
        windowDays !== saved.windowDays ||
        minSimilarity !== saved.minSimilarity ||
        maxCandidates !== saved.maxCandidates),
  );
  const saveDisabled = $derived(saving || loading || !isDirty || !isValid);

  function toggleClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  function apply(config: DedupConfig) {
    enabled = config.enabled;
    windowDays = config.windowDays;
    minSimilarity = config.minSimilarity;
    maxCandidates = config.maxCandidates;
    saved = config;
  }

  async function loadDedup() {
    formError = "";
    loading = true;
    try {
      apply(await fetchDedup());
    } catch (e) {
      formError = e instanceof Error ? e.message : t("dedup.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (saveDisabled) return;
    formError = "";
    saving = true;
    try {
      apply(await updateDedup({ enabled, windowDays, minSimilarity, maxCandidates }));
    } catch (err) {
      formError = err instanceof Error ? err.message : t("dedup.saveFailed");
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    void loadDedup();
  });
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">
    {t("dedup.hint")}
  </p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <div class="space-y-8">
      <div class="space-y-3">
        <span class={labelClass}>{t("dedup.enabled")}</span>
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          role="group"
          aria-label={t("dedup.enabled")}
        >
          <button
            type="button"
            class="transition-colors {toggleClass(enabled)}"
            aria-pressed={enabled}
            disabled={saving}
            onclick={() => (enabled = true)}
          >
            {t("dedup.on")}
          </button>
          <button
            type="button"
            class="transition-colors {toggleClass(!enabled)}"
            aria-pressed={!enabled}
            disabled={saving}
            onclick={() => (enabled = false)}
          >
            {t("dedup.off")}
          </button>
        </div>
      </div>

      <label class="block space-y-2">
        <span class={labelClass}>{t("dedup.windowDays")}</span>
        <input
          type="number"
          min="1"
          max="30"
          step="1"
          bind:value={windowDays}
          class={inputClass}
          disabled={saving}
        />
        <p class={hintClass}>{t("dedup.windowDaysHint")}</p>
      </label>

      <label class="block space-y-2">
        <span class={labelClass}>{t("dedup.minSimilarity")}</span>
        <input
          type="number"
          min="0"
          max="1"
          step="0.05"
          bind:value={minSimilarity}
          class={inputClass}
          disabled={saving}
        />
        <p class={hintClass}>{t("dedup.minSimilarityHint")}</p>
      </label>

      <label class="block space-y-2">
        <span class={labelClass}>{t("dedup.maxCandidates")}</span>
        <input
          type="number"
          min="1"
          max="20"
          step="1"
          bind:value={maxCandidates}
          class={inputClass}
          disabled={saving}
        />
        <p class={hintClass}>{t("dedup.maxCandidatesHint")}</p>
      </label>

      {#if !isValid}
        <p class="text-sm text-red-500">{t("dedup.invalid")}</p>
      {/if}

      <button
        type="button"
        disabled={saveDisabled}
        class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
        onclick={() => void handleSave()}
      >
        {saving ? t("dedup.saving") : t("dedup.save")}
      </button>
    </div>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>
