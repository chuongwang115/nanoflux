<script lang="ts">
  import CheckCheck from "@lucide/svelte/icons/check-check";
  import { t } from "../../lib/locale.svelte";

  type Props = {
    onMarkAllRead: () => void | Promise<void>;
  };

  let { onMarkAllRead }: Props = $props();

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };
  const label = $derived(t("items.markAllRead"));
</script>

<button
  type="button"
  onclick={() => void onMarkAllRead()}
  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
  aria-label={label}
  title={label}
>
  <CheckCheck {...iconProps} />
</button>
