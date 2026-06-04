<script lang="ts">
  import { onMount } from "svelte";
  import Lightbulb from "@lucide/svelte/icons/lightbulb";
  import ArrowDown from "@lucide/svelte/icons/arrow-down";
  import ArrowDownToLine from "@lucide/svelte/icons/arrow-down-to-line";
  import ArrowUp from "@lucide/svelte/icons/arrow-up";
  import ArrowUpToLine from "@lucide/svelte/icons/arrow-up-to-line";
  import Pencil from "@lucide/svelte/icons/pencil";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import ShieldX from "@lucide/svelte/icons/shield-x";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import {
    createFilter,
    deleteFilter,
    fetchFilters,
    reorderFilter,
    updateFilter,
    type Filter,
    type FilterReorderAction,
  } from "../lib/api";
  import { t } from "../lib/locale.svelte";
  import { normalizeCommas } from "../lib/utils";

  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true as const };
  const reorderIconProps = { size: 14, strokeWidth: 1.5, "aria-hidden": true as const };
  const fieldIconProps = { size: 14, strokeWidth: 1.5, "aria-hidden": true as const };
  const actionButtonClass =
    "inline-flex cursor-pointer items-center justify-center rounded-md p-1 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-neutral-400 dark:hover:text-neutral-100 dark:disabled:hover:text-neutral-500";
  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";
  const textareaClass = "min-h-48 resize-y " + inputClass;

  let filters = $state<Filter[]>([]);
  let editId = $state<string | null>(null);
  let name = $state("");
  let whitelist = $state("");
  let blacklist = $state("");
  let prompt = $state("");
  let formError = $state("");
  let listError = $state("");
  let loading = $state(true);

  const isEditing = $derived(editId !== null);

  function previewKeywords(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return t("filters.noKeywords");
    return trimmed
      .replaceAll("，", ",")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .join(", ");
  }

  function previewPrompt(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return trimmed.replace(/\s+/g, " ");
  }

  async function loadFilters() {
    listError = "";
    loading = true;
    try {
      filters = await fetchFilters();
    } catch (e) {
      listError = e instanceof Error ? e.message : t("filters.loadFailed");
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    editId = null;
    name = "";
    whitelist = "";
    blacklist = "";
    prompt = "";
    formError = "";
  }

  function startEdit(filter: Filter) {
    editId = filter.id;
    name = filter.name;
    whitelist = filter.whitelist;
    blacklist = filter.blacklist;
    prompt = filter.prompt;
    formError = "";
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    formError = "";

    const payload = {
      name: name.trim(),
      whitelist: normalizeCommas(whitelist),
      blacklist: normalizeCommas(blacklist),
      prompt: prompt.trim(),
    };

    try {
      if (editId !== null) {
        await updateFilter(editId, payload);
      } else {
        await createFilter(payload);
      }
      resetForm();
      loading = true;
      await loadFilters();
    } catch (err) {
      formError = err instanceof Error ? err.message : t("filters.saveFailed");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("filters.confirmDelete"))) return;
    listError = "";
    try {
      await deleteFilter(id);
      if (editId === id) resetForm();
      loading = true;
      await loadFilters();
    } catch (e) {
      listError = e instanceof Error ? e.message : t("filters.deleteFailed");
    }
  }

  async function handleReorder(id: string, action: FilterReorderAction) {
    listError = "";
    try {
      filters = await reorderFilter(id, action);
    } catch (e) {
      listError = e instanceof Error ? e.message : t("filters.reorderFailed");
      await loadFilters();
    }
  }

  onMount(() => {
    void loadFilters();
  });
</script>

<section class="mb-10">
  <form class="space-y-3" onsubmit={handleSubmit}>
    <input
      type="text"
      bind:value={name}
      required
      placeholder={t("filters.name")}
      class={inputClass}
    />
    <input
      type="text"
      bind:value={whitelist}
      placeholder={t("filters.whitelist")}
      class={inputClass}
    />
    <input
      type="text"
      bind:value={blacklist}
      placeholder={t("filters.blacklist")}
      class={inputClass}
    />
    <textarea
      bind:value={prompt}
      placeholder={t("filters.prompt")}
      class={textareaClass}
    ></textarea>
    <div class="flex gap-4 pt-2">
      <button
        type="submit"
        class="text-sm text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
      >
        {isEditing ? t("filters.save") : t("filters.addFilter")}
      </button>
      {#if isEditing}
        <button
          type="button"
          class="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          onclick={resetForm}
        >
          {t("filters.cancel")}
        </button>
      {/if}
    </div>
  </form>
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>

<section>
  <h2
    class="mb-4 text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
  >
    {t("filters.filterList")}
  </h2>
  {#if listError}
    <p class="text-sm text-red-500">{listError}</p>
  {:else if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else if filters.length === 0}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("filters.noFilters")}</p>
  {:else}
    <ul class="divide-y divide-neutral-100 dark:divide-neutral-800">
      {#each filters as filter, index (filter.id)}
        {@const promptPreview = previewPrompt(filter.prompt)}
        {@const isFirst = index === 0}
        {@const isLast = index === filters.length - 1}
        <li class="group grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5">
          <p class="min-w-0 text-sm font-medium">{filter.name}</p>
          <div class="relative flex shrink-0 items-center">
            <div
              class="absolute right-full mr-2 flex gap-0.5 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 dark:text-neutral-500"
            >
              <button
                type="button"
                class={actionButtonClass}
                aria-label={t("filters.edit")}
                title={t("filters.edit")}
                onclick={() => startEdit(filter)}
              >
                <Pencil {...iconProps} />
              </button>
              <button
                type="button"
                class={actionButtonClass + " hover:text-red-500 disabled:hover:text-neutral-400 dark:disabled:hover:text-neutral-500"}
                aria-label={t("filters.delete")}
                title={t("filters.delete")}
                onclick={() => handleDelete(filter.id)}
              >
                <Trash2 {...iconProps} />
              </button>
              <button
                type="button"
                class={actionButtonClass}
                aria-label={t("filters.moveTop")}
                title={t("filters.moveTop")}
                disabled={isFirst}
                onclick={() => handleReorder(filter.id, "top")}
              >
                <ArrowUpToLine {...reorderIconProps} />
              </button>
              <button
                type="button"
                class={actionButtonClass}
                aria-label={t("filters.moveUp")}
                title={t("filters.moveUp")}
                disabled={isFirst}
                onclick={() => handleReorder(filter.id, "up")}
              >
                <ArrowUp {...reorderIconProps} />
              </button>
              <button
                type="button"
                class={actionButtonClass}
                aria-label={t("filters.moveDown")}
                title={t("filters.moveDown")}
                disabled={isLast}
                onclick={() => handleReorder(filter.id, "down")}
              >
                <ArrowDown {...reorderIconProps} />
              </button>
              <button
                type="button"
                class={actionButtonClass}
                aria-label={t("filters.moveBottom")}
                title={t("filters.moveBottom")}
                disabled={isLast}
                onclick={() => handleReorder(filter.id, "bottom")}
              >
                <ArrowDownToLine {...reorderIconProps} />
              </button>
            </div>
          </div>
          <p
            class="col-span-2 flex items-start gap-1.5 text-sm leading-5 text-neutral-400 dark:text-neutral-500"
          >
            <span
              class="inline-flex h-5 shrink-0 items-center text-neutral-500 dark:text-neutral-400"
              aria-label={t("filters.whitelist")}
              title={t("filters.whitelist")}
            >
              <ShieldCheck {...fieldIconProps} />
            </span>
            <span
              class="min-w-0 line-clamp-2"
              title={filter.whitelist.trim() || undefined}
            >
              {previewKeywords(filter.whitelist)}
            </span>
          </p>
          <p
            class="col-span-2 flex items-start gap-1.5 text-sm leading-5 text-neutral-400 dark:text-neutral-500"
          >
            <span
              class="inline-flex h-5 shrink-0 items-center text-neutral-500 dark:text-neutral-400"
              aria-label={t("filters.blacklist")}
              title={t("filters.blacklist")}
            >
              <ShieldX {...fieldIconProps} />
            </span>
            <span
              class="min-w-0 line-clamp-2"
              title={filter.blacklist.trim() || undefined}
            >
              {previewKeywords(filter.blacklist)}
            </span>
          </p>
          {#if promptPreview}
            <p
              class="col-span-2 flex items-start gap-1.5 text-sm leading-5 text-neutral-400 dark:text-neutral-500"
            >
              <span
                class="inline-flex h-5 shrink-0 items-center text-neutral-500 dark:text-neutral-400"
                aria-label={t("filters.prompt")}
                title={t("filters.prompt")}
              >
                <Lightbulb {...fieldIconProps} />
              </span>
              <span
                class="min-w-0 line-clamp-3"
                title={filter.prompt.trim()}
              >
                {promptPreview}
              </span>
            </p>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</section>
