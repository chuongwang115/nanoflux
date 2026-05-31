export function parsePublishedAt(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const time = Date.parse(trimmed);
  return Number.isNaN(time) ? null : new Date(time).toISOString();
}

export function maxPublishedAt(
  entries: { published_at: string }[],
): string | null {
  if (entries.length === 0) return null;

  let best = entries[0]!.published_at;
  let bestTime = Date.parse(best);
  for (let i = 1; i < entries.length; i++) {
    const published_at = entries[i]!.published_at;
    const time = Date.parse(published_at);
    if (Number.isNaN(time)) continue;
    if (Number.isNaN(bestTime) || time > bestTime) {
      best = published_at;
      bestTime = time;
    }
  }
  return Number.isNaN(bestTime) ? null : best;
}
