const STORAGE_KEY = "nanoflux-filter-accepted";

export function filterAcceptedKey(itemId: string, filterId: string): string {
  return `${itemId}:${filterId}`;
}

export function readFilterAcceptedKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((key): key is string => typeof key === "string"));
  } catch {
    return new Set();
  }
}

export function persistFilterAcceptedKeys(keys: ReadonlySet<string>): void {
  try {
    if (keys.size === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
    }
  } catch {
    /* ignore */
  }
}

export function markFilterAccepted(itemId: string, filterId: string): Set<string> {
  const keys = readFilterAcceptedKeys();
  keys.add(filterAcceptedKey(itemId, filterId));
  persistFilterAcceptedKeys(keys);
  return keys;
}

export function clearFilterAccepted(itemId: string, filterId: string): Set<string> {
  const keys = readFilterAcceptedKeys();
  keys.delete(filterAcceptedKey(itemId, filterId));
  persistFilterAcceptedKeys(keys);
  return keys;
}

export function isFilterAccepted(
  keys: ReadonlySet<string>,
  itemId: string,
  filterId: string,
): boolean {
  return keys.has(filterAcceptedKey(itemId, filterId));
}
