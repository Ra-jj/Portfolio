import { memo, useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { useLcdFontReady } from "../../hooks/useLcdFontReady";
import { usePageVisible } from "../../hooks/usePageVisible";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { LcdScreen } from "../calculator/Lcd";

/** A 16x2 character LCD: no row may be longer than this. */
const CONTACT_LCD_COLUMNS = 16;

/** Row 1: the result of the hero's "=" key. */
const RESULT_ROW = "= LET'S TALK";

/** Typing speed for row 1 (design-plan 7.6). */
const TYPE_CHARACTER_MS = 40;

/** Share of the display that must be on screen before it types. */
const VISIBLE_THRESHOLD = 0.6;

/**
 * The contact panel's status display (design-plan 7.6). Row 1 types
 * "= LET'S TALK" once, the first time the display is on screen in a visible
 * tab with Doto loaded (static under reduced motion). Row 2 is the form's
 * state, passed in by the form; it appears once row 1 has finished, or at
 * once if the form has already left its ready state.
 *
 * A setTimeout chain that only this component re-renders for: one timer per
 * character, cleared on every step and on unmount. Hidden from assistive
 * technology: the status line under the form's button carries the same
 * information as text.
 *
 * @param {{ statusRow: string, isReady: boolean }} props
 *   statusRow: row 2, uppercase, at most 16 characters.
 *   isReady: true while the form is in its resting state (row 2 "READY",
 *   or "USE LINKEDIN" on a build with no endpoint).
 */
function ContactLcd({ statusRow, isReady }) {
  const lcdRef = useRef(null);
  const isFontReady = useLcdFontReady();
  const isPageVisible = usePageVisible();
  const isReducedMotion = useReducedMotion();
  const hasBeenSeen = useInView(lcdRef, { threshold: VISIBLE_THRESHOLD, once: true });
  const [typedCount, setTypedCount] = useState(0);

  // Reduced motion: a static display, so it can power on without waiting to
  // be seen (only for Doto, so it never shows a fallback face).
  const isPowered = isFontReady && (hasBeenSeen || isReducedMotion);
  const titleLength = isReducedMotion ? RESULT_ROW.length : typedCount;
  const isTitleDone = titleLength >= RESULT_ROW.length;
  const isTyping = isPowered && isPageVisible && !isTitleDone;

  useEffect(() => {
    if (!isTyping) return undefined;
    const timer = setTimeout(() => setTypedCount((count) => count + 1), TYPE_CHARACTER_MS);
    return () => clearTimeout(timer);
  }, [isTyping, typedCount]);

  const rows = isPowered
    ? [RESULT_ROW.slice(0, titleLength), isTitleDone || !isReady ? statusRow : ""]
    : ["", ""];
  const cursor = isPowered && !isTitleDone ? { row: 0, column: titleLength } : null;

  return (
    <div ref={lcdRef} aria-hidden="true" className="lcd-bezel contact-lcd">
      <div className="lcd-glass contact-lcd-glass" data-powered={isPowered ? "" : undefined}>
        <LcdScreen
          rows={rows}
          columns={CONTACT_LCD_COLUMNS}
          cursor={cursor}
          className="contact-lcd-text"
        />
      </div>
    </div>
  );
}

export default memo(ContactLcd);
