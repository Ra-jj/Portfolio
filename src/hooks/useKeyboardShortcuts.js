import { useEffect, useRef } from "react";
import {
  ENTER_SHORTCUT_KEY_ID,
  KEYS_BY_ID,
  findKeyByShortcut,
} from "../constants/navigation";

/** Anything the visitor can type into. Shortcuts never fire from these. */
const EDITABLE_SELECTOR = [
  "input",
  "textarea",
  "select",
  '[contenteditable]:not([contenteditable="false"])',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="searchbox"]',
  '[role="spinbutton"]',
].join(", ");

/** keyCode 229 means an IME is composing (older browsers lack isComposing). */
const IME_PROCESS_KEY_CODE = 229;

function isNothingFocused() {
  const active = document.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

/**
 * Maps a keydown event to a key from the key map, or null when the event must
 * be left alone (design-plan 6.5).
 */
function resolveShortcut(event) {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.isComposing ||
    event.keyCode === IME_PROCESS_KEY_CODE
  ) {
    return null;
  }
  // Every browser and OS shortcut (Cmd+R, Ctrl+P, Cmd+L, Ctrl+J, Cmd+G...)
  // keeps working.
  if (event.ctrlKey || event.metaKey || event.altKey) return null;

  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest(EDITABLE_SELECTOR)) return null;
  // Belt and braces for the contact form, including its submit button.
  if (target?.closest("form")) return null;

  if (event.key === "Enter") {
    // Enter on a focused link or button keeps its native meaning.
    return isNothingFocused() ? KEYS_BY_ID[ENTER_SHORTCUT_KEY_ID] : null;
  }
  return findKeyByShortcut(event.key);
}

/**
 * One keydown listener on window for the single-character shortcuts. Nothing
 * is attached while `enabled` is false (the calculator's "shortcuts" switch,
 * WCAG 2.1.4).
 *
 * @param {{ enabled: boolean, onShortcut: (key: object, event: KeyboardEvent) => void }} options
 */
export function useKeyboardShortcuts({ enabled, onShortcut }) {
  const onShortcutRef = useRef(onShortcut);

  useEffect(() => {
    onShortcutRef.current = onShortcut;
  }, [onShortcut]);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      const key = resolveShortcut(event);
      if (!key) return;
      // Stops Firefox's type-ahead find and similar from also reacting.
      event.preventDefault();
      onShortcutRef.current?.(key, event);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
