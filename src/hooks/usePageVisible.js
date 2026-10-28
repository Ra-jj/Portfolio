import { useSyncExternalStore } from "react";

function subscribe(onChange) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function isPageVisible() {
  return document.visibilityState !== "hidden";
}

/** False while the tab is hidden (another tab, minimised window). */
export function usePageVisible() {
  return useSyncExternalStore(subscribe, isPageVisible, () => true);
}
