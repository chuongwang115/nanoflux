export type PassedFilterEntry = {
  id: string;
  keywords: string | null;
  reason: string | null;
};

function isPassedFilterEntry(value: unknown): value is PassedFilterEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as PassedFilterEntry;
  return typeof entry.id === "string" && entry.id.length > 0;
}

/** Serialize passed filter details for `t_items.passed_filters`. */
export function serializePassedFilters(
  entries: PassedFilterEntry[],
): string | null {
  const normalized = entries
    .filter((entry) => entry.id.trim())
    .map((entry) => ({
      id: entry.id.trim(),
      keywords: entry.keywords?.trim() || null,
      reason: entry.reason?.trim() || null,
    }));
  if (normalized.length === 0) return null;
  return JSON.stringify(normalized);
}

/** Whether an item passed filters (derived from `passed_filters`). */
export function isItemFilterPassed(
  passedFilters: string | null,
  hasConfiguredFilters: boolean,
): boolean {
  if (!hasConfiguredFilters) return true;
  return Boolean(passedFilters?.trim());
}

/** Parse `t_items.passed_filters` (JSON array or legacy comma-separated ids). */
export function parsePassedFilters(raw: string | null): PassedFilterEntry[] {
  if (!raw?.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPassedFilterEntry);
  } catch {
    return raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => ({ id, keywords: null, reason: null }));
  }
}
