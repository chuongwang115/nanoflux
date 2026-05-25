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

export function encodeCursor(publishedAt: string, id: string): string {
    return `${publishedAt}|${id}`;
}

export function decodeCursor(cursor: string): { publishedAt: string; id: string } | null {
    
    const sep = cursor.lastIndexOf("|");
    
    if (sep <= 0) {
        return null;
    }
    
    const publishedAt = cursor.slice(0, sep);
    
    const id = cursor.slice(sep + 1);
    
    if (!publishedAt || !id) {
        return null;
    }
    
    return { publishedAt, id };
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