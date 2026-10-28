import { useEffect, useRef, useState } from "react";
import { useLcdFontReady } from "../../hooks/useLcdFontReady";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { LcdScreen } from "../calculator/Lcd";
import Led from "../calculator/Led";

/** The counter reads "02/05": five character cells. */
const COUNTER_COLUMNS = 5;

/**
 * How far the observers' root reaches above the viewport. An entry counts as
 * printed once its top edge is above the paper slot, however far above; a
 * root that only covered the viewport would never report an entry that
 * jumped from below the slot to above the viewport in one step (a deep link
 * or an instant scroll), because its intersection state would not change.
 */
const ROOT_REACH_ABOVE_PX = 1_000_000;

function formatCounter(printed, total) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(printed)}/${pad(total)}`;
}

/**
 * The element's rendered height in whole px, kept current with a
 * ResizeObserver (the printer is 64 px on phones and 72 px from md).
 * null until measured.
 */
function useElementHeight(ref) {
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      console.warn("Printer: the printer element is missing; the counter stays at its start value.");
      return undefined;
    }
    const measure = () => {
      const next = Math.round(element.getBoundingClientRect().height);
      setHeight((previous) => (previous === next ? previous : next));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return height;
}

/**
 * How much of the receipt has come out of the printer, from one
 * IntersectionObserver (never a scroll listener). Its root is the viewport
 * minus the printer's height at the bottom, so its bottom edge is the paper
 * slot while the printer is docked: an entry is printed once its top edge is
 * above that line, and printing is over once the end sentinel is.
 *
 * @returns {{ printed: number, isPrinting: boolean }}
 */
function usePrintProgress({ paperRef, printerRef, isEnabled }) {
  const [progress, setProgress] = useState({ printed: 0, isPrinting: true });
  const slotOffset = useElementHeight(printerRef);

  useEffect(() => {
    if (!isEnabled || slotOffset === null) return undefined;

    const paper = paperRef.current;
    const entries = paper ? [...paper.querySelectorAll("[data-receipt-entry]")] : [];
    const end = paper?.querySelector("[data-receipt-end]") ?? null;
    if (entries.length === 0 || !end) {
      console.warn(
        "Printer: no [data-receipt-entry] or [data-receipt-end] elements in the paper; the counter and LED stay at their start values.",
      );
      return undefined;
    }
    if (typeof IntersectionObserver === "undefined") return undefined;

    const aboveSlot = new Set();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) aboveSlot.add(record.target);
          else aboveSlot.delete(record.target);
        }
        const printed = entries.filter((entry) => aboveSlot.has(entry)).length;
        const isPrinting = !aboveSlot.has(end);
        setProgress((previous) =>
          previous.printed === printed && previous.isPrinting === isPrinting
            ? previous
            : { printed, isPrinting },
        );
      },
      { rootMargin: `${ROOT_REACH_ABOVE_PX}px 0px -${slotOffset}px 0px`, threshold: 0 },
    );
    entries.forEach((entry) => observer.observe(entry));
    observer.observe(end);
    return () => observer.disconnect();
  }, [isEnabled, slotOffset, paperRef]);

  return progress;
}

/**
 * The Journey's receipt printer (design-plan 7.3). CSS makes it sticky at
 * the bottom of the receipt column, opaque and above the paper, so the
 * paper feeds out of its slot as the page scrolls and un-printed paper stays
 * hidden behind it. Rendered after the paper, in the same column. (The
 * fresh-ink band above its slot is the paper's last child, `.receipt-ink`.)
 *
 * The "print" LED is lit while paper is still feeding (the end of the
 * receipt is below the slot); the counter shows how many milestones have
 * come out. Under reduced motion the printer sits still under a finished
 * print: LED off, counter full. Both are decorative (the receipt itself is
 * the content), so the whole printer is hidden from assistive technology.
 *
 * @param {{ paperRef: import("react").RefObject<HTMLElement>, total: number }} props
 */
export default function Printer({ paperRef, total }) {
  const printerRef = useRef(null);
  const isReducedMotion = useReducedMotion();
  const isFontReady = useLcdFontReady();
  const progress = usePrintProgress({ paperRef, printerRef, isEnabled: !isReducedMotion });

  const printed = isReducedMotion ? total : Math.min(progress.printed, total);
  const isPrinting = !isReducedMotion && progress.isPrinting;

  return (
    <div ref={printerRef} aria-hidden="true" className="printer">
      <div className="printer-face">
        <span className="printer-slot" />
        <span className="printer-label">
          <Led isLit={isPrinting} />
          print
        </span>
        <span className="lcd-bezel printer-lcd-bezel">
          <span className="lcd-glass printer-lcd-glass" data-powered={isFontReady ? "" : undefined}>
            <LcdScreen
              rows={[isFontReady ? formatCounter(printed, total) : ""]}
              columns={COUNTER_COLUMNS}
              className="printer-lcd-text"
            />
          </span>
        </span>
      </div>
    </div>
  );
}
