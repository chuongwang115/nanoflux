<script lang="ts">
  import { onMount } from "svelte";
  import { Check, Copy } from "@lucide/svelte";
  import { fetchMcp, generateMcpToken, updateMcp } from "../lib/api";
  import { t } from "../lib/locale.svelte";

  let remoteAccess = $state(false);
  let authorization = $state<string | undefined>();
  let hasAuthorization = $state(false);
  let savedRemoteAccess = $state(false);
  let formError = $state("");
  let loading = $state(true);
  let saving = $state(false);
  let copied = $state(false);
  let endpointCopied = $state(false);

  const endpointUrl = $derived(
    typeof window === "undefined" ? "/mcp" : `${window.location.origin}/mcp`,
  );
  const isDirty = $derived(remoteAccess !== savedRemoteAccess);
  const saveDisabled = $derived(saving || loading || !isDirty);

  function toggleClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  async function loadMcp() {
    loading = true;
    formError = "";
    try {
      const config = await fetchMcp();
      remoteAccess = config.remoteAccess;
      hasAuthorization = config.hasAuthorization;
      savedRemoteAccess = config.remoteAccess;
      authorization = config.authorization;
    } catch (error) {
      formError = error instanceof Error ? error.message : t("mcp.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (saveDisabled) return;
    formError = "";
    saving = true;
    try {
      const updated = await updateMcp({
        remoteAccess,
        ...(remoteAccess && authorization ? { authorization } : {}),
      });
      remoteAccess = updated.remoteAccess;
      hasAuthorization = updated.hasAuthorization;
      savedRemoteAccess = updated.remoteAccess;
      authorization = updated.authorization;
    } catch (error) {
      formError = error instanceof Error ? error.message : t("mcp.saveFailed");
    } finally {
      saving = false;
    }
  }

  async function enableRemoteAccess() {
    if (remoteAccess || saving) return;
    remoteAccess = true;
    formError = "";
    saving = true;
    try {
      authorization = await generateMcpToken();
    } catch (error) {
      remoteAccess = savedRemoteAccess;
      formError = error instanceof Error ? error.message : t("mcp.saveFailed");
    } finally {
      saving = false;
    }
  }

  async function copyAuthorization() {
    if (!authorization) return;
    await navigator.clipboard.writeText(`Authorization: Bearer ${authorization}`);
    copied = true;
    window.setTimeout(() => (copied = false), 1500);
  }

  async function copyEndpoint() {
    await navigator.clipboard.writeText(endpointUrl);
    endpointCopied = true;
    window.setTimeout(() => (endpointCopied = false), 1500);
  }

  onMount(() => void loadMcp());
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">{t("mcp.hint")}</p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{t("mcp.remoteAccess")}</span>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" role="group" aria-label={t("mcp.remoteAccess")}>
          <button type="button" class="transition-colors {toggleClass(!remoteAccess)}" aria-pressed={!remoteAccess} disabled={saving} onclick={() => (remoteAccess = false)}>{t("mcp.localOnly")}</button>
          <button type="button" class="transition-colors {toggleClass(remoteAccess)}" aria-pressed={remoteAccess} disabled={saving} onclick={() => void enableRemoteAccess()}>{t("mcp.remoteEnabled")}</button>
        </div>
      </div>

      {#if remoteAccess}
        <div class="space-y-3">
          <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{t("mcp.authorization")}</span>
          {#if authorization}
            <div class="flex items-center gap-2 rounded bg-neutral-100 p-3 dark:bg-neutral-800">
              <code class="min-w-0 flex-1 break-all text-sm text-neutral-800 dark:text-neutral-100">Authorization: Bearer {authorization}</code>
              <button type="button" class="shrink-0 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" aria-label={t("mcp.copy")} title={t("mcp.copy")} onclick={() => void copyAuthorization()}>
                {#if copied}
                  <Check size={17} />
                {:else}
                  <Copy size={17} />
                {/if}
              </button>
            </div>
            {#if copied}<span class="block text-xs text-neutral-500 dark:text-neutral-400">{t("mcp.copied")}</span>{/if}
            {#if isDirty}
              <span class="block text-xs text-amber-600 dark:text-amber-400">{t("mcp.authorizationSave")}</span>
            {/if}
          {:else}
            <span class="block text-xs text-neutral-400 dark:text-neutral-500">{t("mcp.authorizationConfigured")}</span>
          {/if}
        </div>
      {/if}

      <div class="space-y-2">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">{t("mcp.endpoint")}</span>
        <div class="flex items-center gap-2 rounded bg-neutral-100 p-3 dark:bg-neutral-800">
          <code class="min-w-0 flex-1 break-all text-sm text-neutral-800 dark:text-neutral-100">{endpointUrl}</code>
          <button type="button" class="shrink-0 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" aria-label={t("mcp.copyEndpoint")} title={t("mcp.copyEndpoint")} onclick={() => void copyEndpoint()}>
            {#if endpointCopied}
              <Check size={17} />
            {:else}
              <Copy size={17} />
            {/if}
          </button>
        </div>
        {#if endpointCopied}<span class="block text-xs text-neutral-500 dark:text-neutral-400">{t("mcp.copied")}</span>{/if}
      </div>

      <button type="button" disabled={saveDisabled} class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100" onclick={() => void handleSave()}>{saving ? t("mcp.saving") : t("mcp.save")}</button>
    </div>
  {/if}
  {#if formError}<p class="mt-3 text-sm text-red-500">{formError}</p>{/if}
</section>
