const STORAGE_KEY = "nanoflux-selected-filter";

export const UNMATCHED_FILTER_ID = "__unmatched__";

export function readStoredSelectedFilterId(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value || null;
  } catch {
    return null;
  }
}

export function persistSelectedFilterId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore */
  }
}

/** Keep stored selection only when it matches current filters. */
export function resolveSelectedFilterId(
  storedId: string | null,
  filters: { id: string }[],
): string | null {
  if (!storedId) return null;
  if (storedId === UNMATCHED_FILTER_ID) {
    return filters.length > 0 ? UNMATCHED_FILTER_ID : null;
  }
  return filters.some((f) => f.id === storedId) ? storedId : null;
}
