import { getFilters, type Filter } from "../../filters";
import {
  serializePassedFilters,
  type PassedFilterEntry,
} from "../../shared/passed-filters";
import { applyAiFilter } from "./ai";
import { applyBlacklistFilter } from "./blacklist";
import { applyWhitelistFilter } from "./whitelist";

export type FilterStepResult = {
  passed: boolean;
  keywords: string | null;
  reason: string | null;
};

export type ItemFilterResult = {
  passed_filters: string | null;
};

const PASSED: ItemFilterResult = {
  passed_filters: null,
};

const FAILED: ItemFilterResult = {
  passed_filters: null,
};

async function applyConfiguredFilter(
  title: string,
  content: string | null,
  filter: Filter,
): Promise<FilterStepResult> {
  const blacklist = applyBlacklistFilter(title, content, filter.blacklist);
  if (!blacklist.passed) {
    return blacklist;
  }
  const whitelist = applyWhitelistFilter(title, content, filter.whitelist);
  if (!whitelist.passed) {
    return whitelist;
  }
  return applyAiFilter(
    title,
    content,
    whitelist.keywords,
    filter.prompt,
  );
}

export async function applyItemFilter(
  title: string,
  content: string | null,
): Promise<ItemFilterResult> {
  const filters = getFilters();
  if (filters.length === 0) {
    return PASSED;
  }

  const passed: PassedFilterEntry[] = [];

  for (const filter of filters) {
    const result = await applyConfiguredFilter(title, content, filter);
    if (result.passed) {
      passed.push({
        id: filter.id,
        keywords: result.keywords,
        reason: result.reason,
      });
    }
  }

  if (passed.length === 0) {
    return FAILED;
  }

  return {
    passed_filters: serializePassedFilters(passed),
  };
}

export async function filterItems<
  T extends { title: string; content: string | null },
>(items: T[]): Promise<(T & ItemFilterResult)[]> {
  const filtered: (T & ItemFilterResult)[] = [];
  for (const item of items) {
    filtered.push({
      ...item,
      ...(await applyItemFilter(item.title, item.content)),
    });
  }
  return filtered;
}
