import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KEYS_BY_ID,
  KEY_KIND,
  SHORTCUTS_STORAGE_KEY,
} from "../constants/navigation";
import { useActiveSection } from "../hooks/useActiveSection";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import {
  ActiveSectionContext,
  FLASH_DURATION_MS,
  INSTRUMENT_EVENTS,
  InstrumentContext,
} from "./instrument";

function createEventBus() {
  const listenersByType = new Map();
  return {
    emit(type, payload) {
      for (const listener of listenersByType.get(type) ?? []) {
        try {
          listener(payload);
        } catch (error) {
          // One broken listener must not stop the others (an LCD failing
          // should not stop the keycap press from showing).
          console.error(`Instrument "${type}" listener threw.`, error);
        }
      }
    },
    subscribe(type, listener) {
      if (!listenersByType.has(type)) listenersByType.set(type, new Set());
      listenersByType.get(type).add(listener);
      return () => listenersByType.get(type)?.delete(listener);
    },
  };
}

function readStoredShortcutsEnabled() {
  try {
    return window.localStorage.getItem(SHORTCUTS_STORAGE_KEY) !== "off";
  } catch (error) {
    // Blocked storage is a normal browser setting, not a fault: log it at
    // info level and fall back to the default.
    console.info(
      `localStorage.getItem("${SHORTCUTS_STORAGE_KEY}") threw; shortcuts default to on.`,
      error,
    );
    return true;
  }
}

function storeShortcutsEnabled(enabled) {
  try {
    window.localStorage.setItem(SHORTCUTS_STORAGE_KEY, enabled ? "on" : "off");
  } catch (error) {
    console.warn(
      `localStorage.setItem("${SHORTCUTS_STORAGE_KEY}") threw; the shortcuts setting lasts until the page closes.`,
      error,
    );
  }
}

/** True when the element crosses the horizontal midline of the viewport. */
function isAcrossViewportMiddle(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const middle = window.innerHeight / 2;
  return rect.top <= middle && rect.bottom >= middle;
}

/**
 * Shared state and actions for every part of the instrument: the hero
 * calculator, the sticky bar, the receipt and the contact panel.
 */
export function InstrumentProvider({ children }) {
  const [bus] = useState(createEventBus);
  const [shortcutsEnabled, setShortcutsEnabledState] = useState(readStoredShortcutsEnabled);
  const { activeSection, resyncActiveSection } = useActiveSection();
  const { goToSection, followSectionLink } = useSectionNavigation({
    onPopState: resyncActiveSection,
  });

  const setShortcutsEnabled = useCallback((next) => {
    setShortcutsEnabledState((previous) =>
      Boolean(typeof next === "function" ? next(previous) : next),
    );
  }, []);

  // Only a real change is written. Writing the default on mount would store
  // "on" for every visitor who never touched the switch (and warn for every
  // visitor whose storage is blocked).
  const lastStoredShortcutsEnabled = useRef(shortcutsEnabled);
  useEffect(() => {
    if (lastStoredShortcutsEnabled.current === shortcutsEnabled) return;
    lastStoredShortcutsEnabled.current = shortcutsEnabled;
    storeShortcutsEnabled(shortcutsEnabled);
  }, [shortcutsEnabled]);

  /** Show two rows on the LCDs for `duration` ms, then let them resume. */
  const flashMessage = useCallback(
    (rows, { duration = FLASH_DURATION_MS, keyId = null } = {}) => {
      bus.emit(INSTRUMENT_EVENTS.FLASH, { rows, duration, keyId });
    },
    [bus],
  );

  /** Press feedback for a key: its keycap animates, the LCDs show its message. */
  const pressKey = useCallback(
    (keyId) => {
      const key = KEYS_BY_ID[keyId];
      if (!key) {
        console.warn(`pressKey: "${keyId}" is not in the key map.`);
        return;
      }
      bus.emit(INSTRUMENT_EVENTS.PRESS, { keyId });
      if (key.lcd) flashMessage(key.lcd, { keyId });
    },
    [bus, flashMessage],
  );

  /** AC: the hero LCD clears and replays its intro. */
  const resetDisplay = useCallback(() => {
    bus.emit(INSTRUMENT_EVENTS.RESET);
  }, [bus]);

  /**
   * Performs a key's whole action without a click: press feedback plus the
   * navigation. Used by the keyboard shortcuts. Must be called inside the
   * keydown handler, so window.open counts as a user activation.
   */
  const activateKey = useCallback(
    (keyId) => {
      const key = KEYS_BY_ID[keyId];
      if (!key) {
        console.warn(`activateKey: "${keyId}" is not in the key map.`);
        return;
      }
      pressKey(key.id);
      if (key.kind === KEY_KIND.SECTION) {
        goToSection(key.target);
      } else if (key.kind === KEY_KIND.EXTERNAL) {
        window.open(key.href, "_blank", "noopener,noreferrer");
      } else if (key.id === "ac") {
        // Away from the calculator, go back to it first so the replay is seen.
        if (!isAcrossViewportMiddle(document.getElementById("hero"))) {
          goToSection("hero");
        }
        resetDisplay();
      }
    },
    [goToSection, pressKey, resetDisplay],
  );

  useKeyboardShortcuts({
    enabled: shortcutsEnabled,
    onShortcut: (key) => activateKey(key.id),
  });

  // activeSection is deliberately not in this value: it changes on scroll,
  // and it has its own context so only the sticky bar re-renders for it.
  const value = useMemo(
    () => ({
      shortcutsEnabled,
      setShortcutsEnabled,
      goToSection,
      followSectionLink,
      flashMessage,
      pressKey,
      resetDisplay,
      activateKey,
      subscribe: bus.subscribe,
    }),
    [
      shortcutsEnabled,
      setShortcutsEnabled,
      goToSection,
      followSectionLink,
      flashMessage,
      pressKey,
      resetDisplay,
      activateKey,
      bus,
    ],
  );

  return (
    <InstrumentContext.Provider value={value}>
      <ActiveSectionContext.Provider value={activeSection}>{children}</ActiveSectionContext.Provider>
    </InstrumentContext.Provider>
  );
}
