<script lang="ts">
  import { fontSizeState, setFontSize, type FontSize } from "../lib/fontSize.svelte";
  import { localeState, setLocale, t } from "../lib/locale.svelte";
  import { themeState, setTheme, type Theme } from "../lib/theme.svelte";
  import type { Locale } from "../lib/i18n/messages";

  function optionClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  const fontOptions: { id: FontSize; key: "font.small" | "font.medium" | "font.large" }[] = [
    { id: "small", key: "font.small" },
    { id: "medium", key: "font.medium" },
    { id: "large", key: "font.large" },
  ];

  const localeOptions: { id: Locale; key: "lang.en" | "lang.zhHans" | "lang.zhHant" }[] = [
    { id: "en", key: "lang.en" },
    { id: "zh-Hans", key: "lang.zhHans" },
    { id: "zh-Hant", key: "lang.zhHant" },
  ];

  const themeOptions: { id: Theme; key: "theme.lightMode" | "theme.darkMode" }[] = [
    { id: "light", key: "theme.lightMode" },
    { id: "dark", key: "theme.darkMode" },
  ];
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">
    {t("prefs.hint")}
  </p>
  <div class="space-y-8">
    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {t("prefs.fontSize")}
      </span>
      <div
        class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        role="group"
        aria-label={t("prefs.fontSize")}
      >
        {#each fontOptions as option (option.id)}
          <button
            type="button"
            class="cursor-pointer transition-colors {optionClass(fontSizeState.mode === option.id)}"
            aria-pressed={fontSizeState.mode === option.id}
            onclick={() => setFontSize(option.id)}
          >
            {t(option.key)}
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {t("prefs.language")}
      </span>
      <div
        class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        role="group"
        aria-label={t("prefs.language")}
      >
        {#each localeOptions as option (option.id)}
          <button
            type="button"
            class="cursor-pointer transition-colors {optionClass(localeState.locale === option.id)}"
            aria-pressed={localeState.locale === option.id}
            onclick={() => setLocale(option.id)}
          >
            {t(option.key)}
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-3">
      <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {t("prefs.theme")}
      </span>
      <div
        class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        role="group"
        aria-label={t("prefs.theme")}
      >
        {#each themeOptions as option (option.id)}
          <button
            type="button"
            class="cursor-pointer transition-colors {optionClass(themeState.mode === option.id)}"
            aria-pressed={themeState.mode === option.id}
            onclick={() => setTheme(option.id)}
          >
            {t(option.key)}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
