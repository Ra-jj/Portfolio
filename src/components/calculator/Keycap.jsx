import { useEffect, useState } from "react";
import { PiArrowUpRightBold } from "react-icons/pi";
import { KEYS_BY_ID, KEY_KIND } from "../../constants/navigation";
import { INSTRUMENT_EVENTS, PRESS_HOLD_MS, useInstrument } from "../../context/instrument";
import { cn } from "../../lib/utils";
import Led from "./Led";

function capColour(key) {
  if (key.id === "talk") return "keycap-signal";
  if (key.kind === KEY_KIND.SECTION) return "keycap-aluminium";
  return "keycap-slate"; // external keys and AC
}

/** Shows the pressed state for PRESS_HOLD_MS whenever this key is pressed. */
function usePressedState(keyId, subscribe) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    let releaseTimer;
    const unsubscribe = subscribe(INSTRUMENT_EVENTS.PRESS, (payload) => {
      if (payload?.keyId !== keyId) return;
      clearTimeout(releaseTimer);
      setIsPressed(true);
      releaseTimer = setTimeout(() => setIsPressed(false), PRESS_HOLD_MS);
    });
    return () => {
      unsubscribe();
      clearTimeout(releaseTimer);
    };
  }, [keyId, subscribe]);

  return isPressed;
}

/** Hero keypad layout: shortcut letter top-left, arrow top-right, legend bottom-left. */
function HeroLegend({ keyDef, showShortcut }) {
  const isExternal = keyDef.kind === KEY_KIND.EXTERNAL;

  if (keyDef.glyph) {
    // "=": the glyph is also the shortcut, so it is always printed.
    return (
      <span className="mt-auto flex w-full items-end justify-between gap-2">
        <span aria-hidden="true" className="keycap-glyph">
          {keyDef.glyph}
        </span>
        <span className="keycap-legend">{keyDef.legend}</span>
      </span>
    );
  }

  return (
    <>
      <span aria-hidden="true" className="flex w-full items-start justify-between gap-2">
        {showShortcut ? <span className="keycap-shortcut">{keyDef.shortcut}</span> : <span />}
        {isExternal && <PiArrowUpRightBold className="keycap-arrow" />}
      </span>
      <span className="keycap-legend">{keyDef.legend}</span>
    </>
  );
}

/** Sticky bar layout: LED top-left (lit = this section is on screen), legend bottom-left. */
function BarLegend({ keyDef, isActive }) {
  if (keyDef.glyph) {
    return (
      <>
        <Led isLit={isActive} />
        <span className="bar-key-talk-row">
          <span aria-hidden="true" className="keycap-glyph bar-key-glyph">
            {keyDef.glyph}
          </span>
          <span className="keycap-legend bar-key-talk-legend">{keyDef.legend}</span>
        </span>
      </>
    );
  }
  return (
    <>
      <Led isLit={isActive} />
      <span className="keycap-legend">{keyDef.legend}</span>
    </>
  );
}

/**
 * One key from the key map (src/constants/navigation.js), as a real element:
 * in-page keys are `<a href="#id">`, external keys open a new tab, AC is a
 * `<button>`. Every press goes through the instrument: the cap travels 2 px,
 * the LCDs show the key's message, and in-page keys navigate with
 * followSectionLink (modified clicks are left to the browser).
 *
 * @param {object} props
 * @param {string} props.keyId An id from KEYS_BY_ID.
 * @param {"hero" | "bar"} [props.size]
 * @param {boolean} [props.isActive] Sticky bar only: this key's section is
 *   being read (lit LED, aria-current).
 * @param {string} [props.className]
 */
export default function Keycap({ keyId, size = "hero", isActive = false, className }) {
  const keyDef = KEYS_BY_ID[keyId];
  const { followSectionLink, pressKey, resetDisplay, subscribe, shortcutsEnabled } = useInstrument();
  const isPressed = usePressedState(keyId, subscribe);

  if (!keyDef) {
    console.error(`Keycap: "${keyId}" is not in the key map (src/constants/navigation.js).`);
    return null;
  }

  const handleClick = (event) => {
    pressKey(keyDef.id);
    if (keyDef.kind === KEY_KIND.SECTION) {
      followSectionLink(event, keyDef.target);
    } else if (keyDef.kind === KEY_KIND.ACTION) {
      resetDisplay();
    }
    // External keys open natively in a new tab (no delay, no preventDefault).
  };

  const sharedProps = {
    "aria-label": keyDef.label,
    "data-key-id": keyDef.id,
    "data-pressed": isPressed ? "" : undefined,
    onClick: handleClick,
    className: cn(
      "keycap",
      capColour(keyDef),
      size === "hero" ? "calculator-key" : "bar-key",
      size === "bar" && keyDef.glyph && "bar-key-talk",
      className,
    ),
  };

  const legend =
    size === "hero" ? (
      <HeroLegend keyDef={keyDef} showShortcut={shortcutsEnabled} />
    ) : (
      <BarLegend keyDef={keyDef} isActive={isActive} />
    );

  if (keyDef.kind === KEY_KIND.ACTION) {
    return (
      <button type="button" {...sharedProps}>
        {legend}
      </button>
    );
  }

  return (
    <a
      href={keyDef.href}
      {...(keyDef.kind === KEY_KIND.EXTERNAL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-current={isActive ? "true" : undefined}
      {...sharedProps}
    >
      {legend}
    </a>
  );
}
