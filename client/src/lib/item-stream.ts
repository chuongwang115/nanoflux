import type { Item } from "./api";

type Listener = (items: Item[]) => void;

const listeners = new Set<Listener>();

let es: EventSource | null = null;

function dispatch(items: Item[]) {
  for (const listener of listeners) {
    listener(items);
  }
}

export function subscribeItemStream(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** One shared SSE connection for the whole app session. */
export function connectItemStream(): () => void {
  if (es) return () => {};

  es = new EventSource("/sse");

  es.addEventListener("items", (ev) => {
    try {
      dispatch(JSON.parse(ev.data) as Item[]);
    } catch {
      /* ignore malformed payloads */
    }
  });

  return () => {
    es?.close();
    es = null;
  };
}
