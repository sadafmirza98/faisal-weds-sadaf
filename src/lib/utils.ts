/** Join truthy class names. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Storage wrappers — storage can throw in private mode or when blocked. */
export const safeStorage = {
  get(store: "local" | "session", key: string): string | null {
    try {
      return (store === "local" ? window.localStorage : window.sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(store: "local" | "session", key: string, value: string): boolean {
    try {
      (store === "local" ? window.localStorage : window.sessionStorage).setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(store: "local" | "session", key: string) {
    try {
      (store === "local" ? window.localStorage : window.sessionStorage).removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

/**
 * Deterministic pseudo-random generator (mulberry32). Decorative layouts
 * (stars, candles, particles) use it so server and client markup match.
 */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scrollToId(id: string, reduced = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  // Move focus for keyboard and screen-reader users without a second jump.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/**
 * Round SVG geometry to 2 decimals. Math.sin/cos can differ in the last digit
 * between Node and browsers, which would break hydration.
 */
export const r2 = (n: number) => Math.round(n * 100) / 100;
