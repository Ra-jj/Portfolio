import { useEffect, useState } from "react";
import { PiCalculatorBold } from "react-icons/pi";
import {
  BACK_TO_CALCULATOR,
  BAR_KEY_IDS,
  BAR_LCD_COLUMNS,
  KEYS,
  KEYS_BY_ID,
  KEY_KIND,
} from "../constants/navigation";
import { INSTRUMENT_EVENTS, useActiveSectionId, useInstrument } from "../context/instrument";
import { useInView } from "../hooks/useInView";
import { useLcdFontReady } from "../hooks/useLcdFontReady";
import Keycap from "./calculator/Keycap";
import { LcdScreen } from "./calculator/Lcd";

/**
 * The hero counts as gone once its bottom edge is above this line. The plan's
 * value is the 64 px bar height; 4 px more because IntersectionObserver
 * treats edge-touching boxes as intersecting, and a section landed at
 * --bar-h (sometimes half a pixel off) leaves the hero's bottom edge exactly
 * on that line, which kept the bar hidden after navigating to Journey.
 */
const HERO_ROOT_MARGIN = "-68px 0px 0px 0px";

/** Which key's row 1 the mini LCD shows while a section is being read. */
const KEY_BY_SECTION = Object.freeze(
  Object.fromEntries(
    KEYS.filter((key) => key.kind === KEY_KIND.SECTION && key.lcd).map((key) => [key.target, key]),
  ),
);

/**
 * The bar's one-row, 12-column mini LCD (Doto 18 px, md and up). At rest it
 * names the section being read; a key press anywhere flashes that key's
 * row 1 for the message duration. Blank until Doto is ready.
 */
function BarLcd({ activeSection }) {
  const { subscribe } = useInstrument();
  const isFontReady = useLcdFontReady();
  const [flash, setFlash] = useState(null);

  useEffect(
    () =>
      subscribe(INSTRUMENT_EVENTS.FLASH, ({ rows, duration }) =>
        setFlash({ row: rows[0], duration }),
      ),
    [subscribe],
  );

  useEffect(() => {
    if (!flash) return undefined;
    const timer = setTimeout(() => setFlash(null), flash.duration);
    return () => clearTimeout(timer);
  }, [flash]);

  const restingRow = KEY_BY_SECTION[activeSection]?.lcd[0] ?? "";
  const row = isFontReady ? (flash?.row ?? restingRow) : "";

  return (
    <span aria-hidden="true" className="lcd-bezel bar-lcd-bezel">
      <span className="lcd-glass bar-lcd-glass" data-powered={isFontReady ? "" : undefined}>
        <LcdScreen rows={[row]} columns={BAR_LCD_COLUMNS} className="bar-lcd-text" />
      </span>
    </span>
  );
}

/**
 * The compact bar that takes over navigation once the calculator has left
 * the screen (design-plan 7.2). Slides down in 220 ms (instant under reduced
 * motion), and is `inert` while hidden so Tab never lands on it. The key for
 * the section being read has a lit LED and aria-current. This is the only
 * component that reads the active section.
 */
export default function StickyBar() {
  const isHeroInView = useInView("hero", { rootMargin: HERO_ROOT_MARGIN, initialInView: true });
  const isVisible = !isHeroInView;
  const activeSection = useActiveSectionId();
  const { followSectionLink } = useInstrument();

  return (
    <header
      inert={!isVisible}
      data-visible={isVisible ? "" : undefined}
      className="sticky-bar"
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-2 px-2 sm:px-6 lg:px-8">
        <a
          href={BACK_TO_CALCULATOR.href}
          aria-label={BACK_TO_CALCULATOR.label}
          onClick={(event) => followSectionLink(event, BACK_TO_CALCULATOR.target)}
          className="bar-back"
        >
          <span className="keycap keycap-aluminium bar-key bar-back-key">
            <PiCalculatorBold aria-hidden="true" className="h-5 w-5" />
          </span>
          <BarLcd activeSection={activeSection} />
        </a>

        <nav aria-label="Sections">
          <ul className="bar-keys">
            {BAR_KEY_IDS.map((keyId) => (
              <li key={keyId} className={KEYS_BY_ID[keyId].glyph ? "ml-1 md:ml-3" : undefined}>
                <Keycap
                  keyId={keyId}
                  size="bar"
                  isActive={activeSection !== null && KEYS_BY_ID[keyId].target === activeSection}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
