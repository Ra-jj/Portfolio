import { useId, useRef, useState } from "react";
import { KEYPAD_ROWS, SHORTCUTS_DESCRIPTION } from "../../constants/navigation";
import { useInstrument } from "../../context/instrument";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import Keycap from "./Keycap";
import Lcd from "./Lcd";
import ToggleSwitch from "./ToggleSwitch";

/** The keypad grid has 3 columns; a row with 2 keys gives its last key 2. */
const KEYPAD = KEYPAD_ROWS.flatMap((row) =>
  row.map((keyId, index) => ({
    keyId,
    isWide: row.length === 2 && index === 1,
  })),
);

/**
 * The hero device (design-plan 6.1): control strip with the "hold" and
 * "shortcuts" switches, the 20x2 LCD in its bezel, and the 3x3 keypad whose
 * keys are the site navigation. HTML and CSS only; its width is computed
 * from the LCD's integer font size, so it is the same on every OS.
 */
export default function Calculator() {
  const calculatorRef = useRef(null);
  const shortcutsDescriptionId = useId();
  const { shortcutsEnabled, setShortcutsEnabled } = useInstrument();
  const prefersReduced = useReducedMotion();
  // Under reduced motion the display starts held (static rows); the visitor
  // can still switch hold off. null = the visitor has not touched the switch.
  const [holdChoice, setHoldChoice] = useState(null);
  const isHeld = holdChoice ?? prefersReduced;

  return (
    <div ref={calculatorRef} className="calculator">
      <div className="calculator-strip">
        <ToggleSwitch
          label="hold"
          accessibleName="hold display"
          isOn={isHeld}
          onToggle={setHoldChoice}
        />
        <ToggleSwitch
          label="shortcuts"
          isOn={shortcutsEnabled}
          onToggle={setShortcutsEnabled}
          describedById={shortcutsDescriptionId}
          className="fine-pointer-only"
        />
        <span id={shortcutsDescriptionId} className="sr-only">
          {SHORTCUTS_DESCRIPTION}
        </span>
      </div>

      <Lcd calculatorRef={calculatorRef} isHeld={isHeld} />

      <nav aria-label="Site" className="calculator-keypad-nav">
        <ul className="calculator-keypad">
          {KEYPAD.map(({ keyId, isWide }) => (
            <li key={keyId} className={isWide ? "col-span-2" : undefined}>
              <Keycap keyId={keyId} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
