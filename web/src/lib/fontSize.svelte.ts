const STORAGE_KEY = "nanoflux-font-size";

export type FontSize = "small" | "large";

function readStored(): FontSize | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "small" || v === "large") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export const fontSizeState = $state<{ mode: FontSize }>({ mode: "small" });

export function applyFontSize(f: FontSize) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("font-large", f === "large");
}

export function initFontSize() {
  fontSizeState.mode = readStored() ?? "small";
  applyFontSize(fontSizeState.mode);
}

export function setFontSize(f: FontSize) {
  fontSizeState.mode = f;
  try {
    localStorage.setItem(STORAGE_KEY, f);
  } catch {
    /* ignore */
  }
  applyFontSize(f);
}

export function toggleFontSize() {
  setFontSize(fontSizeState.mode === "small" ? "large" : "small");
}
