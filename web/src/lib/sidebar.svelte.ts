const STORAGE_KEY = "nanoflux-sidebar";

function readStored(): boolean | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "true") return true;
    if (v === "false") return false;
  } catch {
    /* ignore */
  }
  return null;
}

export const sidebarState = $state<{ collapsed: boolean }>({ collapsed: false });

export function initSidebar() {
  sidebarState.collapsed = readStored() ?? false;
}

export function toggleSidebar() {
  sidebarState.collapsed = !sidebarState.collapsed;
  try {
    localStorage.setItem(STORAGE_KEY, String(sidebarState.collapsed));
  } catch {
    /* ignore */
  }
}
