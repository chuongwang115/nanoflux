<script lang="ts">
  import ThumbsDown from "@lucide/svelte/icons/thumbs-down";
  import ThumbsUp from "@lucide/svelte/icons/thumbs-up";
  import { t } from "../../lib/locale.svelte";

  type Props = {
    accepted?: boolean;
    onAccept: () => void | Promise<void>;
    onReject: () => void | Promise<void>;
  };

  let { accepted = false, onAccept, onReject }: Props = $props();

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };
  const buttonClass =
    "inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";
  const acceptLabel = $derived(t("items.filterAccept"));
  const rejectLabel = $derived(t("items.filterReject"));
  const acceptClass = $derived(
    accepted ? "text-neutral-900 dark:text-neutral-100" : "",
  );
</script>

<div class="flex shrink-0 gap-1">
  <button
    type="button"
    class="{buttonClass} {acceptClass}"
    aria-label={acceptLabel}
    aria-pressed={accepted}
    title={acceptLabel}
    onclick={() => void onAccept()}
  >
    <ThumbsUp {...iconProps} />
  </button>
  <button
    type="button"
    class={buttonClass}
    aria-label={rejectLabel}
    title={rejectLabel}
    onclick={() => void onReject()}
  >
    <ThumbsDown {...iconProps} />
  </button>
</div>
