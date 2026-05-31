const STORAGE_KEY = "nanoflux-font-size";
const MIGRATION_KEY = "nanoflux-font-size-v2";

export type FontSize = "small" | "medium" | "large";

function migrateStoredFontSize() {
  try {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    if (localStorage.getItem(STORAGE_KEY) === "small") {
      localStorage.setItem(STORAGE_KEY, "medium");
    }
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function readStored(): FontSize | null {
  try {
    migrateStoredFontSize();
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "small" || v === "medium" || v === "large") return v;
  } catch {
    /* ignore */
  }
  return null;
}

export const fontSizeState = $state<{ mode: FontSize; direction: "up" | "down" }>({
  mode: "medium",
  direction: "up",
});

export function applyFontSize(f: FontSize) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("font-small", f === "small");
  root.classList.toggle("font-large", f === "large");
}

function initDirection(mode: FontSize) {
  if (mode === "small") fontSizeState.direction = "up";
  else if (mode === "large") fontSizeState.direction = "down";
  else fontSizeState.direction = "up";
}

export function initFontSize() {
  fontSizeState.mode = readStored() ?? "medium";
  initDirection(fontSizeState.mode);
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
  const { mode, direction } = fontSizeState;
  if (mode === "small") {
    fontSizeState.direction = "up";
    setFontSize("medium");
  } else if (mode === "large") {
    fontSizeState.direction = "down";
    setFontSize("medium");
  } else if (direction === "up") {
    setFontSize("large");
  } else {
    setFontSize("small");
  }
}
