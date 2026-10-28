import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getMediaQueryList() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY);
}

/**
 * Reads the user's reduced-motion preference right now. For event handlers
 * and timers, which need the value at the moment they run rather than at the
 * last render.
 */
export function prefersReducedMotion() {
  return getMediaQueryList()?.matches ?? false;
}

function subscribe(onChange) {
  const mediaQueryList = getMediaQueryList();
  if (!mediaQueryList) return () => {};
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

/** True while the user asks for reduced motion; re-renders when it changes. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
