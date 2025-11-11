export type Listener = () => void;
const listeners = new Set<Listener>();

export const onUnauthorized = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const emitUnauthorized = () => {
  for (const fn of Array.from(listeners)) {
    try { fn(); } catch {}
  }
};