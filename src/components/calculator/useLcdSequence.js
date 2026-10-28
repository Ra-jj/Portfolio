import { useCallback, useEffect, useReducer, useState } from "react";
import { LCD_TITLE, TAGLINES } from "../../constants/navigation";

/** Script timings from design-plan section 6.3, in milliseconds. */
export const LCD_TIMING = Object.freeze({
  powerOn: 150, // glass tint and ghost cells fade in
  clear: 150, // AC: blank display before the intro replays
  titleCharacter: 55,
  titlePause: 400, // then the cursor drops to row 2
  taglineCharacter: 40,
  taglineHold: 2600,
  eraseCharacter: 16,
  taglineGap: 220,
});

/**
 * Phases of the script. "off", "power" and "clear" are the device's own
 * phases: they run even while the display is held or showing a message.
 */
const PHASE = Object.freeze({
  OFF: "off",
  POWER: "power",
  CLEAR: "clear",
  TYPE_TITLE: "typeTitle",
  TITLE_PAUSE: "titlePause",
  TYPE_TAGLINE: "typeTagline",
  HOLD_TAGLINE: "holdTagline",
  ERASE_TAGLINE: "eraseTagline",
  TAGLINE_GAP: "taglineGap",
});

const DEVICE_PHASES = new Set([PHASE.OFF, PHASE.POWER, PHASE.CLEAR]);

const INITIAL_SCRIPT = Object.freeze({ phase: PHASE.OFF, index: 0, taglineIndex: 0 });

function heldScript(taglineIndex) {
  return {
    phase: PHASE.HOLD_TAGLINE,
    index: TAGLINES[taglineIndex].length,
    taglineIndex,
  };
}

/** The script's next state. `index` counts the characters on screen. */
function nextScript(script, isHeld) {
  const tagline = TAGLINES[script.taglineIndex];
  switch (script.phase) {
    case PHASE.OFF:
      return { ...script, phase: PHASE.POWER };
    case PHASE.POWER:
    case PHASE.CLEAR:
      // Held from the start (reduced motion, or switched on): the static
      // title and tagline, no typing.
      return isHeld
        ? heldScript(script.taglineIndex)
        : { ...script, phase: PHASE.TYPE_TITLE, index: 0 };
    case PHASE.TYPE_TITLE: {
      const index = script.index + 1;
      return index >= LCD_TITLE.length
        ? { ...script, phase: PHASE.TITLE_PAUSE, index: LCD_TITLE.length }
        : { ...script, index };
    }
    case PHASE.TITLE_PAUSE:
      return { ...script, phase: PHASE.TYPE_TAGLINE, index: 0 };
    case PHASE.TYPE_TAGLINE: {
      const index = script.index + 1;
      return index >= tagline.length ? heldScript(script.taglineIndex) : { ...script, index };
    }
    case PHASE.HOLD_TAGLINE:
      return { ...script, phase: PHASE.ERASE_TAGLINE, index: tagline.length - 1 };
    case PHASE.ERASE_TAGLINE: {
      const index = script.index - 1;
      return index <= 0
        ? { ...script, phase: PHASE.TAGLINE_GAP, index: 0 }
        : { ...script, index };
    }
    case PHASE.TAGLINE_GAP:
      return {
        phase: PHASE.TYPE_TAGLINE,
        index: 0,
        taglineIndex: (script.taglineIndex + 1) % TAGLINES.length,
      };
    default:
      console.error(`useLcdSequence: unknown phase "${script.phase}"; restarting the script.`);
      return INITIAL_SCRIPT;
  }
}

function scriptReducer(script, action) {
  switch (action.type) {
    case "advance":
      return nextScript(script, action.isHeld);
    // Hold switched on: finish the current line at once, so switching hold
    // off later resumes from a whole tagline instead of a half-typed one.
    case "complete":
      return script.phase === PHASE.OFF ? script : heldScript(script.taglineIndex);
    // AC: clear, then replay from the title and the first tagline.
    case "clear":
      return script.phase === PHASE.OFF
        ? script
        : { phase: PHASE.CLEAR, index: 0, taglineIndex: 0 };
    default:
      return script;
  }
}

/**
 * How long the current phase stays on screen, or null when it waits
 * indefinitely (a finished tagline while the visitor is using the calculator).
 */
function phaseDuration(script, isAttentive) {
  switch (script.phase) {
    case PHASE.OFF:
      return 0;
    case PHASE.POWER:
      return LCD_TIMING.powerOn;
    case PHASE.CLEAR:
      return LCD_TIMING.clear;
    case PHASE.TYPE_TITLE:
      return LCD_TIMING.titleCharacter;
    case PHASE.TITLE_PAUSE:
      return LCD_TIMING.titlePause;
    case PHASE.TYPE_TAGLINE:
      return LCD_TIMING.taglineCharacter;
    case PHASE.HOLD_TAGLINE:
      return isAttentive ? null : LCD_TIMING.taglineHold;
    case PHASE.ERASE_TAGLINE:
      return LCD_TIMING.eraseCharacter;
    case PHASE.TAGLINE_GAP:
      return LCD_TIMING.taglineGap;
    default:
      return null;
  }
}

const EMPTY_ROWS = Object.freeze(["", ""]);

/** What the script itself puts on the glass. */
function scriptFrame(script) {
  const tagline = TAGLINES[script.taglineIndex];
  switch (script.phase) {
    case PHASE.TYPE_TITLE:
      return {
        rows: [LCD_TITLE.slice(0, script.index), ""],
        cursor: { row: 0, column: script.index },
        isCursorBlinking: false,
      };
    case PHASE.TITLE_PAUSE:
      return {
        rows: [LCD_TITLE, ""],
        cursor: { row: 0, column: LCD_TITLE.length },
        isCursorBlinking: true,
      };
    case PHASE.TYPE_TAGLINE:
    case PHASE.ERASE_TAGLINE:
      return {
        rows: [LCD_TITLE, tagline.slice(0, script.index)],
        cursor: { row: 1, column: script.index },
        isCursorBlinking: false,
      };
    case PHASE.HOLD_TAGLINE:
      return {
        rows: [LCD_TITLE, tagline],
        cursor: { row: 1, column: tagline.length },
        isCursorBlinking: true,
      };
    case PHASE.TAGLINE_GAP:
      return {
        rows: [LCD_TITLE, ""],
        cursor: { row: 1, column: 0 },
        isCursorBlinking: false,
      };
    default:
      return { rows: EMPTY_ROWS, cursor: null, isCursorBlinking: false };
  }
}

/**
 * The hero LCD's script (design-plan 6.3) as a chain of single setTimeouts:
 * each step schedules exactly one timer, and every timer is cleared when the
 * step changes, the display pauses or the component unmounts. No
 * requestAnimationFrame, no intervals.
 *
 * Precedence of what the glass shows:
 * 1. off (not yet powered: before Doto is ready and the LCD first on screen);
 * 2. overrideRows (a key's message or hover/focus preview);
 * 3. the device phases (power-on, AC clear): blank;
 * 4. held: title + current tagline in full, no cursor;
 * 5. the script (typing, holding, erasing).
 *
 * @param {object} options
 * @param {boolean} options.isRunning On screen, tab visible and Doto ready.
 *   While false nothing is scheduled.
 * @param {boolean} options.isHeld The "hold" switch (WCAG 2.2.2).
 * @param {boolean} options.isAttentive Pointer over or keyboard focus inside
 *   the calculator: the current line finishes, then waits.
 * @param {readonly [string, string] | null} options.overrideRows
 * @returns {{
 *   frame: { isPowered: boolean, rows: readonly string[], cursor: { row: number, column: number } | null, isCursorBlinking: boolean },
 *   clear: () => void,
 * }}
 */
export function useLcdSequence({ isRunning, isHeld, isAttentive, overrideRows }) {
  const [script, dispatch] = useReducer(scriptReducer, INITIAL_SCRIPT);

  // Hold switched on: complete the line now (React's "adjust state when a
  // prop changes" pattern; no effect, no extra frame on screen).
  const [previousIsHeld, setPreviousIsHeld] = useState(isHeld);
  if (previousIsHeld !== isHeld) {
    setPreviousIsHeld(isHeld);
    if (isHeld) dispatch({ type: "complete" });
  }

  const isDevicePhase = DEVICE_PHASES.has(script.phase);
  const canAdvance = isRunning && (isDevicePhase || (!isHeld && !overrideRows));
  const duration = canAdvance ? phaseDuration(script, isAttentive) : null;

  useEffect(() => {
    if (duration === null) return undefined;
    const timer = setTimeout(() => dispatch({ type: "advance", isHeld }), duration);
    return () => clearTimeout(timer);
  }, [script, duration, isHeld]);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  let frame;
  if (script.phase === PHASE.OFF) {
    frame = { isPowered: false, rows: EMPTY_ROWS, cursor: null, isCursorBlinking: false };
  } else if (overrideRows) {
    frame = { isPowered: true, rows: overrideRows, cursor: null, isCursorBlinking: false };
  } else if (isDevicePhase) {
    frame = { isPowered: true, rows: EMPTY_ROWS, cursor: null, isCursorBlinking: false };
  } else if (isHeld) {
    frame = {
      isPowered: true,
      rows: [LCD_TITLE, TAGLINES[script.taglineIndex]],
      cursor: null,
      isCursorBlinking: false,
    };
  } else {
    frame = { isPowered: true, ...scriptFrame(script) };
  }

  return { frame, clear };
}
