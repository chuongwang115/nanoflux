<script lang="ts">
  import { onMount } from "svelte";
  import { fetchFilter, updateFilter } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;

  let prompt = $state("");
  let formError = $state("");
  let savedHint = $state("");
  let loading = $state(true);
  let saving = $state(false);

  async function loadFilter() {
    formError = "";
    loading = true;
    try {
      const filter = await fetchFilter();
      prompt = filter.prompt;
    } catch (e) {
      formError = e instanceof Error ? e.message : t("filters.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    formError = "";
    savedHint = "";
    saving = true;

    try {
      const updated = await updateFilter({ prompt: prompt.trim() });
      prompt = updated.prompt;
      savedHint = t("filters.saved");
    } catch (err) {
      formError = err instanceof Error ? err.message : t("filters.saveFailed");
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    void loadFilter();
  });
</script>

<section class="mb-10">
  <p class="mb-4 text-sm text-neutral-400 dark:text-neutral-500">
    {t("filters.hint")}
  </p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <form class="space-y-3" onsubmit={handleSubmit}>
      <textarea
        bind:value={prompt}
        placeholder={t("filters.prompt")}
        class={textareaClass}
      ></textarea>
      <div class="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
        >
          {saving ? t("filters.saving") : t("filters.save")}
        </button>
        {#if savedHint}
          <span class="text-sm text-neutral-400 dark:text-neutral-500">{savedHint}</span>
        {/if}
      </div>
    </form>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>
