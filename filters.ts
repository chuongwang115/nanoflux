import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

const FILTERS_PATH = resolve(process.cwd(), "filters.json");
const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
const ID_LENGTH = 4;

export type Filter = {
  id: string;
  name: string;
  whitelist: string;
  blacklist: string;
  prompt: string;
};

export type FilterInput = {
  name: string;
  whitelist?: string;
  blacklist?: string;
  prompt?: string;
};

export type FilterReorderAction = "up" | "down" | "top" | "bottom";

let filters: Filter[] = [];

function isValidFilterId(id: string): boolean {
  return new RegExp(`^[a-z0-9]{${ID_LENGTH}}$`).test(id);
}

function randomFilterId(): string {
  const bytes = randomBytes(ID_LENGTH);
  let id = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    id += ID_CHARS[bytes[i]! % ID_CHARS.length];
  }
  return id;
}

function allocateFilterId(): string {
  for (;;) {
    const id = randomFilterId();
    if (!filters.some((filter) => filter.id === id)) {
      return id;
    }
  }
}

async function readFiltersFile(): Promise<Partial<Filter>[]> {
  const data = await readFile(FILTERS_PATH, "utf-8");
  const parsed = JSON.parse(data);
  if (!Array.isArray(parsed)) {
    throw new Error("filters.json must be an array");
  }
  return parsed;
}

async function writeFiltersFile(): Promise<void> {
  const data = JSON.stringify(filters, null, 2);
  await writeFile(FILTERS_PATH, data, "utf-8");
}

function normalizeFilter(raw: Partial<Filter>): Filter {
  const id =
    raw.id && isValidFilterId(raw.id) ? raw.id : allocateFilterId();

  return {
    id,
    name: raw.name?.trim() ?? "",
    whitelist: raw.whitelist ?? "",
    blacklist: raw.blacklist ?? "",
    prompt: raw.prompt ?? "",
  };
}

export async function loadFilters(): Promise<void> {
  try {
    const raw = await readFiltersFile();
    filters = [];
    const normalized = raw.map((entry) => normalizeFilter(entry));
    const needsPersist = raw.some(
      (entry, index) =>
        !entry.id ||
        !isValidFilterId(entry.id) ||
        normalized[index]?.id !== entry.id ||
        "created_at" in entry ||
        "updated_at" in entry,
    );
    filters = normalized;
    if (needsPersist) {
      await writeFiltersFile();
    }
  } catch (error) {
    console.error("Error loading filters:", error);
    filters = [];
  }
}

export function getFilters(): Filter[] {
  return [...filters];
}

export function getFilter(id: string): Filter | null {
  return filters.find((filter) => filter.id === id) ?? null;
}

export async function createFilter(input: FilterInput): Promise<Filter> {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Filter name is required");
  }

  const created: Filter = {
    id: allocateFilterId(),
    name,
    whitelist: input.whitelist ?? "",
    blacklist: input.blacklist ?? "",
    prompt: input.prompt ?? "",
  };

  filters.push(created);
  await writeFiltersFile();
  return created;
}

export async function updateFilter(
  id: string,
  input: Partial<FilterInput>,
): Promise<Filter> {
  const index = filters.findIndex((filter) => filter.id === id);
  if (index === -1) {
    throw new Error("Filter does not exist");
  }

  const existing = filters[index]!;
  const name =
    input.name !== undefined ? input.name.trim() : existing.name;
  if (!name) {
    throw new Error("Filter name is required");
  }

  const updated: Filter = {
    ...existing,
    name,
    whitelist:
      input.whitelist !== undefined ? input.whitelist : existing.whitelist,
    blacklist:
      input.blacklist !== undefined ? input.blacklist : existing.blacklist,
    prompt: input.prompt !== undefined ? input.prompt : existing.prompt,
  };

  filters[index] = updated;
  await writeFiltersFile();
  return updated;
}

export async function deleteFilter(id: string): Promise<boolean> {
  const index = filters.findIndex((filter) => filter.id === id);
  if (index === -1) {
    throw new Error("Filter does not exist");
  }

  filters.splice(index, 1);
  await writeFiltersFile();
  return true;
}

function moveFilter(from: number, to: number): void {
  if (from === to) return;
  const [item] = filters.splice(from, 1);
  if (!item) return;
  filters.splice(to, 0, item);
}

export async function reorderFilter(
  id: string,
  action: FilterReorderAction,
): Promise<Filter[]> {
  const index = filters.findIndex((filter) => filter.id === id);
  if (index === -1) {
    throw new Error("Filter does not exist");
  }

  let target = index;
  switch (action) {
    case "up":
      target = index - 1;
      break;
    case "down":
      target = index + 1;
      break;
    case "top":
      target = 0;
      break;
    case "bottom":
      target = filters.length - 1;
      break;
  }

  if (target < 0 || target >= filters.length || target === index) {
    return getFilters();
  }

  moveFilter(index, target);
  await writeFiltersFile();
  return getFilters();
}
