import { createContext, useContext } from "react";

/**
 * Events broadcast to the device parts. LCDs and keycaps subscribe to these
 * instead of reading React state, so a flash or a press re-renders only the
 * part that shows it.
 * - FLASH: { rows: [string, string], duration: number, keyId: string | null }
 * - PRESS: { keyId: string } (a keycap shows its pressed state)
 * - RESET: undefined (AC: the hero LCD clears and replays its intro)
 */
export const INSTRUMENT_EVENTS = Object.freeze({
  FLASH: "flash",
  PRESS: "press",
  RESET: "reset",
});

/** How long an LCD shows a key's message before resuming (design-plan 6.3). */
export const FLASH_DURATION_MS = 1600;

/**
 * How long a keyboard or shortcut press holds a keycap down (design-plan
 * 6.4), so it shows the same travel as a pointer press.
 */
export const PRESS_HOLD_MS = 140;

/**
 * Actions and settings. Provided by <InstrumentProvider> in
 * src/context/InstrumentContext.jsx. Its value only changes when the
 * shortcuts switch is flipped, never on scroll.
 */
export const InstrumentContext = createContext(null);

/**
 * The section currently being read (or null). Kept in its own context so the
 * parts that only need actions (calculator, keycaps, LCD) do not re-render
 * while the visitor scrolls. `undefined` means "no provider".
 */
export const ActiveSectionContext = createContext(undefined);

/**
 * @returns {{
 *   shortcutsEnabled: boolean,
 *   setShortcutsEnabled: (next: boolean | ((previous: boolean) => boolean)) => void,
 *   goToSection: (id: string, options?: { delay?: number, focus?: boolean }) => boolean,
 *   followSectionLink: (event: MouseEvent, id: string) => void,
 *   flashMessage: (rows: [string, string], options?: { duration?: number, keyId?: string }) => void,
 *   pressKey: (keyId: string) => void,
 *   resetDisplay: () => void,
 *   activateKey: (keyId: string) => void,
 *   subscribe: (type: string, listener: (payload: unknown) => void) => () => void,
 * }}
 */
export function useInstrument() {
  const context = useContext(InstrumentContext);
  if (!context) {
    throw new Error("useInstrument must be used inside <InstrumentProvider>.");
  }
  return context;
}

/**
 * The id of the section crossing the reading band ("timeline", "projects",
 * "skills" or "contact"), or null (for example while the hero is on screen).
 * Only the sticky bar should read this.
 *
 * @returns {string | null}
 */
export function useActiveSectionId() {
  const activeSection = useContext(ActiveSectionContext);
  if (activeSection === undefined) {
    throw new Error("useActiveSectionId must be used inside <InstrumentProvider>.");
  }
  return activeSection;
}
