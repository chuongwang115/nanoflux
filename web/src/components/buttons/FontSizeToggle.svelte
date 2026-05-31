<script lang="ts">
  import AArrowDown from "@lucide/svelte/icons/a-arrow-down";
  import AArrowUp from "@lucide/svelte/icons/a-arrow-up";
  import {
    fontSizeState,
    toggleFontSize,
    type FontSize,
  } from "../../lib/fontSize.svelte";
  import { t } from "../../lib/locale.svelte";

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };

  const nextSize = $derived<FontSize>(
    fontSizeState.mode === "small" || fontSizeState.mode === "large"
      ? "medium"
      : fontSizeState.direction === "up"
        ? "large"
        : "small",
  );

  const increasing = $derived(
    fontSizeState.mode === "small" ||
      (fontSizeState.mode === "medium" && fontSizeState.direction === "up"),
  );

  const switchLabel = $derived(
    nextSize === "medium"
      ? t("font.switchToMedium")
      : nextSize === "large"
        ? t("font.switchToLarge")
        : t("font.switchToSmall"),
  );

  const currentLabel = $derived(
    fontSizeState.mode === "small"
      ? t("font.small")
      : fontSizeState.mode === "medium"
        ? t("font.medium")
        : t("font.large"),
  );
</script>

<button
  type="button"
  onclick={toggleFontSize}
  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
  aria-label={switchLabel}
  title={currentLabel}
>
  {#if increasing}
    <AArrowUp {...iconProps} />
  {:else}
    <AArrowDown {...iconProps} />
  {/if}
</button>
