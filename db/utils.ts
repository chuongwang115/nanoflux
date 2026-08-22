export enum TimeUnit {
    MINUTE = 60 * 1000,
    HOUR = 60 * 60 * 1000,
    DAY = 24 * 60 * 60 * 1000,
}

let lastItemId = 0;

const ITEM_ID_SEQ_DIGITS = 2;
const ITEM_ID_SEQ_MOD = 10 ** ITEM_ID_SEQ_DIGITS;

/** UTC `YYYYMMDDHHMMSS` as an integer (14 digits). */
function utcCompactSecond(date: Date): number {
  return (
    date.getUTCFullYear() * 10000000000 +
    (date.getUTCMonth() + 1) * 100000000 +
    date.getUTCDate() * 1000000 +
    date.getUTCHours() * 10000 +
    date.getUTCMinutes() * 100 +
    date.getUTCSeconds()
  );
}

/**
 * Integer item id that grows with ingest time (`created_at`), not `published_at`.
 * Format: UTC `YYYYMMDDHHMMSS` + 2-digit per-second sequence (16 digits, JSON-safe).
 */
export function newItemId(): number {
  const candidate = utcCompactSecond(new Date()) * ITEM_ID_SEQ_MOD;
  lastItemId = candidate > lastItemId ? candidate : lastItemId + 1;
  return lastItemId;
}

/** Parse a positive integer feed id from a route/MCP value. */
export function parseFeedId(value: string | number): number | null {
  return parsePositiveId(value);
}

/** Parse a positive integer item id from a route/MCP value. */
export function parseItemId(value: string | number): number | null {
  return parsePositiveId(value);
}

function parsePositiveId(value: string | number): number | null {
    if (typeof value === "number") {
        return Number.isSafeInteger(value) && value > 0 ? value : null;
    }
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const n = Number.parseInt(trimmed, 10);
    return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export function encodeCursor(sortTime: string, id: string | number): string {
    return `${sortTime}|${id}`;
}

export function decodeCursor(cursor: string): { sortTime: string; id: string } | null {
    
    const sep = cursor.lastIndexOf("|");
    
    if (sep <= 0) {
        return null;
    }
    
    const sortTime = cursor.slice(0, sep);
    
    const id = cursor.slice(sep + 1);
    
    if (!sortTime || !id) {
        return null;
    }
    
    return { sortTime, id };
}

export function parseTimeUnit(unit: string): TimeUnit | null {
    switch (unit) {
        case "minute":
        case "min":
        case "分":
            return TimeUnit.MINUTE;
        case "hour":
        case "h":
        case "时":
            return TimeUnit.HOUR;
        case "day":
        case "d":
        case "天":
            return TimeUnit.DAY;
        default:
            return null;
    }
}

export function parseTimeRange(unit: string, count: number): { since: string; until: string } {
    const parsedUnit = parseTimeUnit(unit);
    if (!parsedUnit) {
        throw new Error(`Invalid time unit: ${unit}`);
    }
    return { since: new Date(Date.now() - count * parsedUnit).toISOString(), until: new Date().toISOString() };
}

/** SQLite datetime('now') is UTC without timezone; normalize to ISO 8601 UTC. */
export function toUtcIso(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  const isoCandidate = trimmed.includes("T")
    ? trimmed
    : `${trimmed.replace(" ", "T")}Z`;
  const time = Date.parse(isoCandidate);
  return Number.isNaN(time) ? trimmed : new Date(time).toISOString();
}

export function parseFeedGuids(value: string | null | undefined): Set<string> {
  if (!value) return new Set();

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((guid): guid is string => typeof guid === "string"));
  } catch {
    return new Set();
  }
}

export function serializeFeedGuids(guids: string[]): string {
  return JSON.stringify(guids);
}