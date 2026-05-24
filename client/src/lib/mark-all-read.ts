export const MARK_ALL_READ_KEY = Symbol("markAllRead");

export type MarkAllReadHost = {
  register: (handler: (() => void | Promise<void>) | undefined) => void;
  markAllRead: () => void;
};

export function createMarkAllReadHost(): MarkAllReadHost {
  let handler: (() => void | Promise<void>) | undefined;

  return {
    register(next) {
      handler = next;
    },
    markAllRead() {
      void handler?.();
    },
  };
}
