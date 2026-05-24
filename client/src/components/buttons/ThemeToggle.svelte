<script lang="ts">
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { t } from "../../lib/locale.svelte";
  import { themeState, toggleTheme } from "../../lib/theme.svelte";

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };
</script>

<button
  type="button"
  onclick={toggleTheme}
  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
  aria-label={themeState.mode === "dark"
    ? t("theme.switchToLight")
    : t("theme.switchToDark")}
  title={themeState.mode === "dark" ? t("theme.lightMode") : t("theme.darkMode")}
>
  {#if themeState.mode === "dark"}
    <Sun {...iconProps} />
  {:else}
    <Moon {...iconProps} />
  {/if}
</button>
