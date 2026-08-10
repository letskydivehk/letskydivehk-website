import React from "react";

const RELOAD_KEY = "chunk-reload-attempt";

/**
 * React.lazy wrapper that survives stale chunk URLs after a new deploy.
 * Retries the dynamic import once with a cache-busting reload fallback,
 * instead of leaving the app on a blank screen.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return React.lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      // Retry once — transient network hiccup.
      try {
        return await factory();
      } catch {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, "1");
          window.location.reload();
          // Never resolves; the page is reloading.
          return await new Promise<{ default: T }>(() => {});
        }
        throw err;
      }
    }
  });
}
