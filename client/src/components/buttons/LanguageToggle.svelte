<script lang="ts">
  import { localeState, toggleLocale, t } from "../../lib/locale.svelte";

  const label = $derived(localeState.locale === "zh" ? "EN" : "中");
  const aria = $derived(
    localeState.locale === "zh" ? t("lang.switchToEn") : t("lang.switchToZh"),
  );
</script>

<button
  type="button"
  onclick={toggleLocale}
  class="inline-flex min-w-[2rem] cursor-pointer items-center justify-center rounded-md p-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
  aria-label={aria}
  title={aria}
>
  {label}
</button>
