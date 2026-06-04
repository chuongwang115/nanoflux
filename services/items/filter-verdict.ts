import { getFilter, updateFilter } from "../../filters";
import { getItemById, updateItemPassedFilters } from "../../db/items";
import { removePassedFilterEntry } from "../../shared/passed-filters";
import {
  optimizeFilterPromptFromAcceptance,
  optimizeFilterPromptFromRejection,
} from "../filters/prompt-feedback";

export type FilterVerdictResult = {
  passed_filters: string | null;
  is_read: number;
  promptUpdated: boolean;
};

async function updateFilterPromptIfChanged(
  filterId: string,
  nextPrompt: string | null,
): Promise<boolean> {
  if (!nextPrompt) return false;

  const filter = getFilter(filterId);
  if (!filter) {
    throw new Error(`Filter ${filterId} not found`);
  }
  if (nextPrompt === filter.prompt.trim()) return false;

  await updateFilter(filterId, {
    name: filter.name,
    whitelist: filter.whitelist,
    blacklist: filter.blacklist,
    prompt: nextPrompt,
  });
  return true;
}

export async function acceptItemForFilter(
  itemId: string,
  filterId: string,
): Promise<FilterVerdictResult> {
  const item = getItemById(itemId);
  if (!item) {
    throw new Error(`Item ${itemId} not found`);
  }

  const filter = getFilter(filterId);
  if (!filter) {
    throw new Error(`Filter ${filterId} not found`);
  }

  const nextPrompt = await optimizeFilterPromptFromAcceptance(
    item.title,
    item.content,
    filter.name,
    filter.prompt,
  );
  const promptUpdated = await updateFilterPromptIfChanged(filterId, nextPrompt);

  return {
    passed_filters: item.passed_filters,
    is_read: item.is_read,
    promptUpdated,
  };
}

export async function rejectItemForFilter(
  itemId: string,
  filterId: string,
): Promise<FilterVerdictResult> {
  const item = getItemById(itemId);
  if (!item) {
    throw new Error(`Item ${itemId} not found`);
  }

  const filter = getFilter(filterId);
  if (!filter) {
    throw new Error(`Filter ${filterId} not found`);
  }

  const nextPrompt = await optimizeFilterPromptFromRejection(
    item.title,
    item.content,
    filter.name,
    filter.prompt,
  );
  const promptUpdated = await updateFilterPromptIfChanged(filterId, nextPrompt);

  const passed_filters = removePassedFilterEntry(item.passed_filters, filterId);
  updateItemPassedFilters(itemId, passed_filters);

  return {
    passed_filters,
    is_read: item.is_read,
    promptUpdated,
  };
}
