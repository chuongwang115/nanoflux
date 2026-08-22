<script lang="ts">
  import Eye from "@lucide/svelte/icons/eye";
  import EyeClosed from "@lucide/svelte/icons/eye-closed";
  import { t } from "../../lib/locale.svelte";

  type ItemFilter = "unread" | "all";

  type Props = {
    filter: ItemFilter;
    onToggle: () => void;
  };

  let { filter, onToggle }: Props = $props();

  const iconProps = { size: 18, strokeWidth: 1.5, "aria-hidden": true as const };
  const label = $derived(
    filter === "unread" ? t("items.switchToAll") : t("items.switchToUnread"),
  );
  const title = $derived(
    filter === "unread" ? t("items.filterUnread") : t("items.filterAll"),
  );
</script>

<button
  type="button"
  onclick={onToggle}
  class="inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors {filter ===
  'unread'
    ? 'text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800'
    : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'}"
  aria-label={label}
  aria-pressed={filter === "unread"}
  title={title}
>
  {#if filter === "unread"}
    <Eye {...iconProps} />
  {:else}
    <EyeClosed {...iconProps} />
  {/if}
</button>
