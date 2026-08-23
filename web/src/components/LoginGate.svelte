<script lang="ts">
  import { submitLogin } from "../lib/auth.svelte";
  import { t } from "../lib/locale.svelte";
  import LanguageToggle from "./buttons/LanguageToggle.svelte";
  import ThemeToggle from "./buttons/ThemeToggle.svelte";

  const inputClass =
    "w-full border-0 border-b border-neutral-200 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-300 focus:border-neutral-900 dark:border-neutral-700 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100";

  let password = $state("");
  let submitting = $state(false);
  let error = $state("");

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (submitting) return;
    error = "";
    submitting = true;
    try {
      await submitLogin(password);
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      if (message === "Invalid password") error = t("auth.invalid");
      else if (message === "Too many login attempts") error = t("auth.tooMany");
      else error = message || t("auth.failed");
    } finally {
      submitting = false;
    }
  }
</script>

<main class="flex min-h-screen items-center justify-center px-5">
  <form class="w-full max-w-sm" onsubmit={handleSubmit}>
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-medium tracking-tight">NanoFlux</h1>
      <div class="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
    <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
      {t("auth.hint")}
    </p>
    <label class="mt-8 block">
      <span class="sr-only">{t("auth.password")}</span>
      <input
        class={inputClass}
        type="password"
        name="password"
        autocomplete="current-password"
        placeholder={t("auth.password")}
        bind:value={password}
        disabled={submitting}
      />
    </label>
    {#if error}
      <p class="mt-3 text-sm text-red-500">{error}</p>
    {/if}
    <button
      type="submit"
      class="mt-8 w-full cursor-pointer rounded-md bg-neutral-900 py-2 text-sm text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      disabled={submitting || !password}
    >
      {submitting ? t("auth.submitting") : t("auth.submit")}
    </button>
  </form>
</main>
