import { Fragment, memo, useEffect, useRef, useState } from "react";
import { KEYS_BY_ID, LCD_COLUMNS } from "../../constants/navigation";
import { INSTRUMENT_EVENTS, useInstrument } from "../../context/instrument";
import { useInView } from "../../hooks/useInView";
import { useLcdFontReady } from "../../hooks/useLcdFontReady";
import { usePageVisible } from "../../hooks/usePageVisible";
import { cn } from "../../lib/utils";
import { useLcdSequence } from "./useLcdSequence";

/**
 * One row of character cells. Doto's own period is a plus-shaped cluster, so
 * "." is drawn as a square decimal point element one cell wide (like a
 * calculator's DP segment). The block cursor is a CSS element positioned on
 * the cell grid; on a full row it sits on the last cell, as on a real
 * character LCD.
 */
function LcdRow({ text, cursorColumn, isCursorBlinking }) {
  const segments = text.split(".");
  return (
    <span className="lcd-row" data-text={text}>
      {segments.map((segment, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="lcd-dp" />}
          {segment}
        </Fragment>
      ))}
      {cursorColumn !== null && (
        <span
          className="lcd-cursor"
          data-blink={isCursorBlinking ? "" : undefined}
          style={{ "--cursor-column": cursorColumn }}
        />
      )}
    </span>
  );
}

/**
 * The glass of a character LCD: `columns` cells per row, ghost cells always
 * drawn, text in Doto. Font size comes from the parent (an integer px value,
 * design-plan section 3), and the text box is exactly `columns x 0.6em` wide.
 * Purely presentational; the caller hides it from screen readers.
 */
export function LcdScreen({ rows, columns, cursor = null, isCursorBlinking = false, className }) {
  return (
    <span className={cn("lcd-text lcd-screen", className)} style={{ "--lcd-columns": columns }}>
      {rows.map((text, rowIndex) => (
        <LcdRow
          key={rowIndex}
          text={text}
          cursorColumn={cursor?.row === rowIndex ? Math.min(cursor.column, columns - 1) : null}
          isCursorBlinking={isCursorBlinking}
        />
      ))}
    </span>
  );
}

/** Neither the pointer nor keyboard focus is on the calculator. */
const OUTSIDE = Object.freeze({ isInside: false, keyId: null });

function keyIdAt(target) {
  return target instanceof Element ? (target.closest("[data-key-id]")?.dataset.keyId ?? null) : null;
}

function isHoverPointer(event) {
  return event.pointerType === "mouse" || event.pointerType === "pen";
}

function sameState(previous, next) {
  return previous.isInside === next.isInside && previous.keyId === next.keyId;
}

/**
 * Watches the calculator for a hovering mouse and for keyboard focus, with
 * delegated listeners on its root (keycaps carry `data-key-id`). Touch is
 * ignored: on a phone the message on press is the feedback. Focus only
 * counts when it is keyboard focus (:focus-visible), so a mouse click that
 * focuses a link does not leave the display paused.
 */
function useCalculatorAttention(rootRef) {
  const [pointer, setPointer] = useState(OUTSIDE);
  const [focus, setFocus] = useState(OUTSIDE);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      console.warn("Lcd: the calculator root element is missing; hover and focus previews are off.");
      return undefined;
    }

    const update = (setState, next) =>
      setState((previous) => (sameState(previous, next) ? previous : next));

    const handlePointerOver = (event) => {
      if (!isHoverPointer(event)) return;
      update(setPointer, { isInside: true, keyId: keyIdAt(event.target) });
    };
    const handlePointerLeave = () => update(setPointer, OUTSIDE);
    const handleFocusIn = (event) => {
      const isKeyboardFocus = event.target instanceof Element && event.target.matches(":focus-visible");
      update(
        setFocus,
        isKeyboardFocus ? { isInside: true, keyId: keyIdAt(event.target) } : OUTSIDE,
      );
    };
    const handleFocusOut = (event) => {
      if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
      update(setFocus, OUTSIDE);
    };

    root.addEventListener("pointerover", handlePointerOver);
    root.addEventListener("pointerleave", handlePointerLeave);
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("focusout", handleFocusOut);
    return () => {
      root.removeEventListener("pointerover", handlePointerOver);
      root.removeEventListener("pointerleave", handlePointerLeave);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("focusout", handleFocusOut);
    };
  }, [rootRef]);

  const previewKeyId = pointer.keyId ?? focus.keyId;
  return {
    isAttentive: pointer.isInside || focus.isInside,
    previewRows: previewKeyId ? (KEYS_BY_ID[previewKeyId]?.lcd ?? null) : null,
  };
}

/**
 * The hero calculator's 20x2 LCD (design-plan 6.3). Boots once Doto is ready
 * and the display is at least half on screen in a visible tab; pauses every
 * timer otherwise. Shows a key's rows on hover or keyboard focus (preview)
 * and for 1600 ms on press (message). Only this component re-renders while
 * it types.
 *
 * @param {{ calculatorRef: import("react").RefObject<HTMLElement>, isHeld: boolean }} props
 */
function Lcd({ calculatorRef, isHeld }) {
  const lcdRef = useRef(null);
  const { subscribe } = useInstrument();
  const isOnScreen = useInView(lcdRef, { threshold: 0.5 });
  const isPageVisible = usePageVisible();
  const isFontReady = useLcdFontReady();
  const isActive = isOnScreen && isPageVisible;
  const { isAttentive, previewRows } = useCalculatorAttention(calculatorRef);
  const [flash, setFlash] = useState(null);

  // Going off screen drops a message that is still showing, so it does not
  // reappear stale when the visitor comes back.
  const [wasActive, setWasActive] = useState(isActive);
  if (wasActive !== isActive) {
    setWasActive(isActive);
    if (!isActive) setFlash(null);
  }

  const { frame, clear } = useLcdSequence({
    isRunning: isActive && isFontReady,
    isHeld,
    isAttentive,
    overrideRows: flash?.rows ?? previewRows,
  });

  // Messages only reach the display while it is on screen.
  useEffect(() => {
    if (!isActive) return undefined;
    return subscribe(INSTRUMENT_EVENTS.FLASH, ({ rows, duration }) => setFlash({ rows, duration }));
  }, [isActive, subscribe]);

  useEffect(
    () =>
      subscribe(INSTRUMENT_EVENTS.RESET, () => {
        setFlash(null);
        clear();
      }),
    [subscribe, clear],
  );

  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), flash.duration);
    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <div ref={lcdRef} aria-hidden="true" className="lcd-bezel calculator-bezel">
      <div className="lcd-glass calculator-glass" data-powered={frame.isPowered ? "" : undefined}>
        <LcdScreen
          rows={frame.rows}
          columns={LCD_COLUMNS}
          cursor={frame.cursor}
          isCursorBlinking={frame.isCursorBlinking}
          className="calculator-lcd-text"
        />
      </div>
    </div>
  );
}

export default memo(Lcd);
