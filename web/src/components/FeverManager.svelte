<script lang="ts">
  import { onMount } from "svelte";
  import { Check, Copy } from "@lucide/svelte";
  import { fetchFever, updateFever } from "../lib/api";
  import { t } from "../lib/locale.svelte";
  import { isStrongPassword } from "../../../shared/password-strength";

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";

  let enabled = $state(false);
  let user = $state("");
  let password = $state("");
  let hasPassword = $state(false);
  let savedEnabled = $state(false);
  let savedUser = $state("");
  let formError = $state("");
  let loading = $state(true);
  let saving = $state(false);
  let endpointCopied = $state(false);

  const endpointUrl = $derived(
    typeof window === "undefined" ? "/fever/" : `${window.location.origin}/fever/`,
  );

  const isDirty = $derived(
    enabled !== savedEnabled || user.trim() !== savedUser || password.length > 0,
  );
  const saveDisabled = $derived(saving || loading || !isDirty);

  function toggleClass(active: boolean): string {
    return active
      ? "text-neutral-900 underline underline-offset-4 decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-100"
      : "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300";
  }

  async function loadFever() {
    formError = "";
    loading = true;
    try {
      const config = await fetchFever();
      enabled = config.enabled;
      user = config.user;
      hasPassword = config.hasPassword;
      password = "";
      savedEnabled = config.enabled;
      savedUser = config.user;
    } catch (e) {
      formError = e instanceof Error ? e.message : t("fever.loadFailed");
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (saveDisabled) return;
    formError = "";

    if (enabled && !user.trim()) {
      formError = t("fever.userRequired");
      return;
    }
    if (enabled && !hasPassword && !password) {
      formError = t("fever.passwordRequired");
      return;
    }
    if (password.length > 0 && !isStrongPassword(password)) {
      formError = t("fever.passwordWeak");
      return;
    }

    saving = true;
    try {
      const payload: { enabled: boolean; user: string; password?: string } = {
        enabled,
        user: user.trim(),
      };
      if (password.length > 0) {
        payload.password = password;
      }
      const updated = await updateFever(payload);
      enabled = updated.enabled;
      user = updated.user;
      hasPassword = updated.hasPassword;
      password = "";
      savedEnabled = updated.enabled;
      savedUser = updated.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      formError = message.includes("at least 8 characters")
        ? t("fever.passwordWeak")
        : message || t("fever.saveFailed");
    } finally {
      saving = false;
    }
  }

  async function copyEndpoint() {
    await navigator.clipboard.writeText(endpointUrl);
    endpointCopied = true;
    window.setTimeout(() => (endpointCopied = false), 1500);
  }

  onMount(() => {
    void loadFever();
  });
</script>

<section class="mb-10">
  <p class="mb-6 text-sm text-neutral-400 dark:text-neutral-500">
    {t("fever.hint")}
  </p>
  {#if loading}
    <p class="text-sm text-neutral-300 dark:text-neutral-600">{t("items.loading")}</p>
  {:else}
    <div class="space-y-8">
      <div class="space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("fever.enabled")}
        </span>
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
          role="group"
          aria-label={t("fever.enabled")}
        >
          <button
            type="button"
            class="transition-colors {toggleClass(enabled)}"
            aria-pressed={enabled}
            disabled={saving}
            onclick={() => (enabled = true)}
          >
            {t("fever.on")}
          </button>
          <button
            type="button"
            class="transition-colors {toggleClass(!enabled)}"
            aria-pressed={!enabled}
            disabled={saving}
            onclick={() => (enabled = false)}
          >
            {t("fever.off")}
          </button>
        </div>
      </div>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("fever.user")}
        </span>
        <input
          type="text"
          bind:value={user}
          class={inputClass}
          autocomplete="username"
          disabled={saving}
        />
      </label>

      <label class="block space-y-3">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("fever.password")}
        </span>
        <input
          type="password"
          bind:value={password}
          class={inputClass}
          autocomplete="new-password"
          placeholder={hasPassword ? t("fever.passwordKeep") : ""}
          disabled={saving}
        />
      </label>

      <div class="space-y-2">
        <span class="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("fever.endpoint")}
        </span>
        <div class="flex items-center gap-2 rounded bg-neutral-100 p-3 dark:bg-neutral-800">
          <code class="min-w-0 flex-1 break-all text-sm text-neutral-800 dark:text-neutral-100">{endpointUrl}</code>
          <button type="button" class="shrink-0 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" aria-label={t("fever.copyEndpoint")} title={t("fever.copyEndpoint")} onclick={() => void copyEndpoint()}>
            {#if endpointCopied}
              <Check size={17} />
            {:else}
              <Copy size={17} />
            {/if}
          </button>
        </div>
        {#if endpointCopied}<span class="block text-xs text-neutral-500 dark:text-neutral-400">{t("fever.copied")}</span>{/if}
      </div>

      <button
        type="button"
        disabled={saveDisabled}
        class="text-sm text-neutral-900 underline-offset-4 hover:underline disabled:opacity-50 dark:text-neutral-100"
        onclick={() => void handleSave()}
      >
        {saving ? t("fever.saving") : t("fever.save")}
      </button>
    </div>
  {/if}
  {#if formError}
    <p class="mt-3 text-sm text-red-500">{formError}</p>
  {/if}
</section>
