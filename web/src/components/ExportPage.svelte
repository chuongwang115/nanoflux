<script lang="ts">
  import { onMount } from "svelte";
  import Download from "@lucide/svelte/icons/download";
  import { t } from "../lib/locale.svelte";
  import { downloadItemsExcel, fetchFilters, type Filter } from "../lib/api";

  /** Special scope id for "all articles" (not a filter id). */
  const SCOPE_ALL = "__all__";

  /** Format a Date as a local-time `datetime-local` value (`YYYY-MM-DDTHH:mm`). */
  function toDatetimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    );
  }

  const nowDate = new Date();

  let filters = $state<Filter[]>([]);
  let scope = $state<string>(SCOPE_ALL);
  // Default to the last 24 hours.
  let start = $state(toDatetimeLocal(new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)));
  let end = $state(toDatetimeLocal(nowDate));
  let exporting = $state(false);
  let error = $state("");

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";

  function scopeButtonClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  /** `datetime-local` value (local wall-clock) → ISO 8601 UTC. */
  function toIso(local: string): string | undefined {
    if (!local) return undefined;
    const ms = Date.parse(local);
    if (Number.isNaN(ms)) return undefined;
    return new Date(ms).toISOString();
  }

  function scopeParams(): { filterPassed?: 0 | 1; passedFilterId?: string } {
    if (scope === SCOPE_ALL) return {};
    return { passedFilterId: scope };
  }

  async function handleExport() {
    if (exporting) return;
    error = "";

    const since = toIso(start);
    const until = toIso(end);
    if (since && until && since > until) {
      error = t("export.invalidRange");
      return;
    }

    exporting = true;
    try {
      await downloadItemsExcel({ since, until, ...scopeParams() });
    } catch (e) {
      error = e instanceof Error ? e.message : t("export.failed");
    } finally {
      exporting = false;
    }
  }

  onMount(() => {
    void (async () => {
      try {
        filters = await fetchFilters();
      } catch {
        filters = [];
      }
    })();
  });
</script>

<section class="space-y-8">
  <p class="text-sm text-neutral-400 dark:text-neutral-500">
    {t("export.hint")}
  </p>

  <div class="grid gap-6 sm:grid-cols-2">
    <label class="block space-y-2">
      <span class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {t("export.startTime")}
      </span>
      <!-- lang="sv-SE" forces a 24-hour, ISO-style (yyyy-mm-dd HH:mm) picker. -->
      <input
        type="datetime-local"
        lang="sv-SE"
        bind:value={start}
        class={inputClass}
      />
    </label>
    <label class="block space-y-2">
      <span class="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {t("export.endTime")}
      </span>
      <input
        type="datetime-local"
        lang="sv-SE"
        bind:value={end}
        class={inputClass}
      />
    </label>
  </div>

  <div class="space-y-3">
    <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
      {t("export.scope")}
    </span>
    <div
      class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
      role="group"
      aria-label={t("export.scope")}
    >
      <button
        type="button"
        class="transition-colors {scopeButtonClass(scope === SCOPE_ALL)}"
        aria-pressed={scope === SCOPE_ALL}
        onclick={() => (scope = SCOPE_ALL)}
      >
        {t("export.scopeAll")}
      </button>
      {#each filters as f (f.id)}
        <button
          type="button"
          class="transition-colors {scopeButtonClass(scope === f.id)}"
          aria-pressed={scope === f.id}
          onclick={() => (scope = f.id)}
        >
          {f.name}
        </button>
      {/each}
    </div>
  </div>

  <div class="flex items-center gap-4">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
      disabled={exporting}
      onclick={() => void handleExport()}
    >
      <Download size={16} strokeWidth={1.5} aria-hidden={true} />
      {exporting ? t("export.exporting") : t("export.button")}
    </button>
  </div>

  {#if error}
    <p class="text-sm text-red-500">{error}</p>
  {/if}
</section>
