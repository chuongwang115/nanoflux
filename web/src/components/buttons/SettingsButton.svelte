<script lang="ts">
  import Settings from "@lucide/svelte/icons/settings";
  import { navClick, route, settingsHref } from "../../lib/router";
  import { t } from "../../lib/locale.svelte";

  let { collapsed = false }: { collapsed?: boolean } = $props();

  const iconProps = { size: 16, strokeWidth: 1.5, "aria-hidden": true as const };
  const active = $derived($route === "/settings");
</script>

<a
  href={settingsHref()}
  onclick={navClick("/settings")}
  class="flex items-center rounded-md text-sm transition-colors {collapsed
    ? 'justify-center p-2 md:justify-center'
    : 'gap-2 px-2 py-1.5'} {active
    ? 'text-neutral-900 dark:text-neutral-100'
    : 'text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100'}"
  aria-current={active ? "page" : undefined}
  title={collapsed ? t("items.settings") : undefined}
>
  <Settings {...iconProps} />
  <span class={collapsed ? "md:sr-only" : ""}>{t("items.settings")}</span>
</a>
