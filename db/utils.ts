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