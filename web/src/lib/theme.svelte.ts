const STORAGE_KEY = "nanoflux-theme";

export type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function systemPrefersDark(): boolean {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export const themeState = $state<{ mode: Theme }>({ mode: "light" });

export function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function initTheme() {
  themeState.mode = readStored() ?? (systemPrefersDark() ? "dark" : "light");
  applyTheme(themeState.mode);
}

export function setTheme(t: Theme) {
  themeState.mode = t;
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
  applyTheme(t);
}

export function toggleTheme() {
  setTheme(themeState.mode === "light" ? "dark" : "light");
}
