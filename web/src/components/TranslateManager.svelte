<script lang="ts">
  import { onMount } from "svelte";
  import {
    fetchTranslate,
    TRANSLATE_TARGET_LANGS,
    updateTranslate,
    type TranslateTargetLang,
  } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;

  let prompt = $state("");
  let enabled = $state(false);
  let targetLang = $state<TranslateTargetLang>("zh-Hans");
  let savedPrompt = $state("");
  let savedEnabled = $state(false);
  let savedTargetLang = $state<TranslateTargetLang>("zh-Hans");
  let formError = $state("");
  let loading = $state(true);
  let saving = $state(false);

  const isDirty = $derived(
    prompt.trim() !== savedPrompt ||
      enabled !== savedEnabled ||
      targetLang !== savedTargetLang,
  );
  const saveDisabled = $derived(saving || loading || !isDirty);

  function toggleClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  async function loadTranslate() {
    formError = "";
    loading = true;
    try {
      const config = await fetchTranslate();
      prompt = config.prompt;
      enabled = config.enabled;
      targetLang = config.targetLang;
      savedPrompt = config.prompt;
      savedEnabled = config.enabled;
      savedTargetLang = config.targetLang;
    } catch (e) {
      formError = e instanceof Error ? e.message : t("translate.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (saveDisabled) return;
    formError = "";
    saving = true;

    try {
      const updated = await updateTranslate({
        prompt: prompt.trim(),
        enabled,
        targetLang,
      });
      prompt = updated.prompt;
      enabled = updated.enabled;
      targetLang = updated.targetLang;
      savedPrompt = updated.prompt;
      savedEnabled = updated.enabled;
      savedTargetLang = updated.targetLang;
    } catch (err) {
      formError = err instanceof Error ? err.message : t("translate.saveFailed");
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    void loadTranslate();
  });
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">
    {t("translate.hint")}
  </p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("translate.enabled")}
        </span>
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          role="group"
          aria-label={t("translate.enabled")}
        >
          <button
            type="button"
            class="transition-colors {toggleClass(enabled)}"
            aria-pressed={enabled}
            disabled={saving}
            onclick={() => (enabled = true)}
          >
            {t("translate.on")}
          </button>
          <button
            type="button"
            class="transition-colors {toggleClass(!enabled)}"
            aria-pressed={!enabled}
            disabled={saving}
            onclick={() => (enabled = false)}
          >
            {t("translate.off")}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("translate.targetLang")}
        </span>
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          role="group"
          aria-label={t("translate.targetLang")}
        >
          {#each TRANSLATE_TARGET_LANGS as lang (lang)}
            <button
              type="button"
              class="transition-colors {toggleClass(targetLang === lang)}"
              aria-pressed={targetLang === lang}
              disabled={saving}
              onclick={() => (targetLang = lang)}
            >
              {t(
                lang === "en"
                  ? "translate.langEn"
                  : lang === "zh-Hans"
                    ? "translate.langZhHans"
                    : "translate.langZhHant",
              )}
            </button>
          {/each}
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("translate.prompt")}
        </span>
        <textarea bind:value={prompt} class={textareaClass} disabled={saving}></textarea>
      </label>

      <button
        type="button"
        disabled={saveDisabled}
        class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
        onclick={() => void handleSave()}
      >
        {saving ? t("translate.saving") : t("translate.save")}
      </button>
    </div>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>
