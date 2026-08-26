import {
  getFilterState,
  loadAppConfig,
  updateFilterState,
  type FilterConfig,
} from "./config";

export type { FilterConfig };

export async function loadFilters(): Promise<void> {
  await loadAppConfig();
}

/** Current filter prompt (may be empty). */
export function getFilterPrompt(): string {
  return getFilterState().prompt;
}

export function getFilterConfig(): FilterConfig {
  return getFilterState();
}

/** Whether AI filtering is active (enabled and non-empty prompt). */
export function hasFilterPrompt(): boolean {
  const { prompt, enabled } = getFilterState();
  return enabled && prompt.trim().length > 0;
}

/** Whether title keyword filtering is active under the shared filter switch. */
export function hasKeywordFilter(): boolean {
  const { keywords, enabled } = getFilterState();
  return (
    enabled &&
    keywords.split(/[,，]/).some((keyword) => keyword.trim().length > 0)
  );
}

export async function updateFilterConfig(partial: {
  prompt?: string;
  enabled?: boolean;
  keywords?: string;
}): Promise<FilterConfig> {
  return updateFilterState(partial);
}

export async function updateFilterPrompt(prompt: string): Promise<FilterConfig> {
  return updateFilterConfig({ prompt });
}
