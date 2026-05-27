<script lang="ts">
  import AArrowDown from "@lucide/svelte/icons/a-arrow-down";
  import AArrowUp from "@lucide/svelte/icons/a-arrow-up";
  import { fontSizeState, toggleFontSize } from "../../lib/fontSize.svelte";
  import { t } from "../../lib/locale.svelte";

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };
</script>

<button
  type="button"
  onclick={toggleFontSize}
  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
  aria-label={fontSizeState.mode === "large"
    ? t("font.switchToSmall")
    : t("font.switchToLarge")}
  title={fontSizeState.mode === "large" ? t("font.small") : t("font.large")}
>
  {#if fontSizeState.mode === "large"}
    <AArrowDown {...iconProps} />
  {:else}
    <AArrowUp {...iconProps} />
  {/if}
</button>
