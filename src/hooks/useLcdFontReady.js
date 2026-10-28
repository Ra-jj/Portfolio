import { useSyncExternalStore } from "react";

/** The face every LCD draws with (design-plan section 3). */
const LCD_FONT = '800 24px "Doto Variable"';

/** After this long the LCDs start anyway, in whatever face is available. */
export const LCD_FONT_TIMEOUT_MS = 1500;

let isSettled = false;
let settledPromise = null;

/**
 * Starts loading Doto once per page. Resolves when the face has loaded, or
 * after LCD_FONT_TIMEOUT_MS, whichever comes first.
 */
function waitForLcdFont() {
  if (settledPromise) return settledPromise;

  const fonts = typeof document !== "undefined" ? document.fonts : undefined;
  if (!fonts?.load) {
    isSettled = true;
    settledPromise = Promise.resolve();
    return settledPromise;
  }

  // No document.fonts.check() shortcut: it also returns true for a family
  // the page has not declared yet, which would let a fallback face through.
  // load() resolves at once when Doto is already loaded.
  const loaded = fonts.load(LCD_FONT).then(
    () => undefined,
    (error) => {
      console.warn(`document.fonts.load('${LCD_FONT}') rejected; the LCDs start with a fallback face.`, error);
    },
  );
  const timedOut = new Promise((resolve) => {
    setTimeout(resolve, LCD_FONT_TIMEOUT_MS);
  });
  settledPromise = Promise.race([loaded, timedOut]).then(() => {
    isSettled = true;
  });
  return settledPromise;
}

function subscribe(onChange) {
  let isSubscribed = true;
  waitForLcdFont().then(() => {
    if (isSubscribed) onChange();
  });
  return () => {
    isSubscribed = false;
  };
}

function getSnapshot() {
  return isSettled;
}

/**
 * True once Doto is ready (or the 1500 ms wait is over). Until then an LCD
 * shows only its ghost cells, so it never flashes a fallback face.
 */
export function useLcdFontReady() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
