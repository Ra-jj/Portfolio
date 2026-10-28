import { useCallback, useEffect, useState } from "react";
import { PRESS_HOLD_MS } from "../context/instrument";

/**
 * Pressed state for a keycap that is not in the key map (the receipt's "="
 * key, the project links). A pointer press already shows through `:active`;
 * `press()` also holds `data-pressed` for PRESS_HOLD_MS, so a keyboard
 * activation (Enter on a focused link fires `click`, never `:active`) shows
 * the same 2 px travel (design-plan 6.4).
 *
 * @returns {[boolean, () => void]} [isPressed, press]
 */
export function usePressHold() {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!isPressed) return undefined;
    const timer = setTimeout(() => setIsPressed(false), PRESS_HOLD_MS);
    return () => clearTimeout(timer);
  }, [isPressed]);

  const press = useCallback(() => setIsPressed(true), []);

  return [isPressed, press];
}
