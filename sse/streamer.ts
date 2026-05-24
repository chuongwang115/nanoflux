import type { ItemWithFeed } from "../db/items";

type ItemBatch = ItemWithFeed[];
type Listener = (batch: ItemBatch) => void;

const HEARTBEAT_INTERVAL_MS = 15_000;

export type ItemStreamEvent =
  | { event: "items"; data: ItemBatch }
  | { event: "ping"; data: {} };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const listeners = new Set<Listener>();

export function emitNewItems(items: ItemBatch): void {
  if (items.length === 0) return;
  for (const listener of listeners) listener(items);
}

class WaitQueue<T> {
  private pending: T[] = [];
  private waiters: ((value: T) => void)[] = [];

  push(value: T) {
    const next = this.waiters.shift();
    if (next) next(value);
    else this.pending.push(value);
  }

  take(): Promise<T> {
    const ready = this.pending.shift();
    if (ready !== undefined) return Promise.resolve(ready);
    return new Promise((resolve) => this.waiters.push(resolve));
  }
}

export async function* streamNewItems(): AsyncGenerator<
  ItemStreamEvent,
  void,
  unknown
> {
  const queue = new WaitQueue<ItemBatch>();
  const unsubscribe = (batch: ItemBatch) => queue.push(batch);
  listeners.add(unsubscribe);

  let pendingTake: Promise<ItemBatch> | null = null;

  try {
    for (;;) {
      if (!pendingTake) pendingTake = queue.take();

      const result = await Promise.race([
        pendingTake.then((batch) => ({ kind: "items" as const, batch })),
        delay(HEARTBEAT_INTERVAL_MS).then(() => ({ kind: "ping" as const })),
      ]);

      if (result.kind === "ping") {
        yield { event: "ping", data: {} };
        continue;
      }

      pendingTake = null;
      yield { event: "items", data: result.batch };
    }
  } finally {
    listeners.delete(unsubscribe);
  }
}
