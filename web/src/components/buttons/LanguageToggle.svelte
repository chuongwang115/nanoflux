<script lang="ts">
  import { nextLocale } from "../../../../shared/locale";
  import { localeState, toggleLocale, t } from "../../lib/locale.svelte";

  const next = $derived(nextLocale(localeState.locale));
  const label = $derived(
    next === "en" ? "EN" : next === "zh-Hans" ? "简" : "繁",
  );
  const aria = $derived(
    next === "en"
      ? t("lang.switchToEn")
      : next === "zh-Hans"
        ? t("lang.switchToZhHans")
        : t("lang.switchToZhHant"),
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
