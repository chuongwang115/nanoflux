export enum TimeUnit {
    MINUTE = 60 * 1000,
    HOUR = 60 * 60 * 1000,
    DAY = 24 * 60 * 60 * 1000,
}

export function feedIdFromUrl(url: string): string {
    return Bun.hash.xxHash32(url).toString(16).padStart(8, "0");
}

export function newItemId(): string {
    return Bun.randomUUIDv7();
}

export function encodeCursor(sortTime: string, id: string): string {
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