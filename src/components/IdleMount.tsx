import { useEffect, useState, type ComponentType } from "react";

/**
 * Defers mounting a heavy/non-critical component until the browser is idle
 * (or after a max delay). Renders nothing initially to keep first paint light.
 */
export function IdleMount<P extends object>({
  load,
  delay = 2000,
}: {
  load: () => Promise<{ default: ComponentType<P> }> | ComponentType<P>;
  delay?: number;
}) {
  const [Comp, setComp] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const mod = await Promise.resolve(load());
      if (cancelled) return;
      const Resolved = (mod && (mod as { default?: ComponentType<P> }).default) || (mod as ComponentType<P>);
      setComp(() => Resolved);
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    };
    const w = window as IdleWindow;
    let handle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (typeof w.requestIdleCallback === "function") {
      handle = w.requestIdleCallback(() => run(), { timeout: delay });
    } else {
      timer = setTimeout(run, delay);
    }
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [load, delay]);

  if (!Comp) return null;
  return <Comp {...({} as P)} />;
}
