// The store persists to localStorage; give node an in-memory one so tests run without a browser.
const data = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  },
  configurable: true,
});
// zustand's persist reads window.localStorage.
Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
