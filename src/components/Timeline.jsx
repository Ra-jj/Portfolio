import { useRef } from "react";
import { journey } from "../constants/journey";
import { AVAILABILITY, KEYS_BY_ID } from "../constants/navigation";
import { useInstrument } from "../context/instrument";
import { usePressHold } from "../hooks/usePressHold";
import Printer from "./receipt/Printer";
import ReceiptEntry from "./receipt/ReceiptEntry";

const TALK_KEY = KEYS_BY_ID.talk;

/**
 * The small "=" key at the end of the receipt. Same behaviour as the other
 * in-page keys (design-plan 6.4): the cap travels, the LCDs show the key's
 * message, and the shared navigation goes to #contact (modified clicks are
 * left to the browser). It presses only itself, not the hero or bar "=".
 */
function ReceiptTalkKey() {
  const { flashMessage, followSectionLink } = useInstrument();
  const [isPressed, press] = usePressHold();

  const handleClick = (event) => {
    press();
    flashMessage(TALK_KEY.lcd, { keyId: TALK_KEY.id });
    followSectionLink(event, TALK_KEY.target);
  };

  return (
    <a
      href={TALK_KEY.href}
      aria-label={TALK_KEY.label}
      data-pressed={isPressed ? "" : undefined}
      onClick={handleClick}
      className="keycap keycap-signal receipt-key"
    >
      <span aria-hidden="true" className="keycap-glyph receipt-key-glyph">
        {TALK_KEY.glyph}
      </span>
      <span className="keycap-legend">{TALK_KEY.legend}</span>
    </a>
  );
}

/**
 * Journey (design-plan 7.3): the milestones print on a receipt that feeds
 * out of a sticky printer as the page scrolls. Native scroll and CSS sticky
 * only; the printer's counter and LED use IntersectionObservers.
 *
 * lg+: heading sticky in columns 1-4, receipt in columns 5-12. Below lg the
 * heading sits above the receipt. The receipt column holds the paper, then
 * the printer, and must have no overflow clipping on any ancestor.
 */
const Timeline = () => {
  const paperRef = useRef(null);

  return (
    <section id="timeline" className="py-20 md:py-24">
      <div className="mx-auto grid max-w-[1200px] px-3 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="receipt-heading lg:col-span-4">
          <h2
            tabIndex={-1}
            className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.015em] text-ink md:text-[40px] xl:text-[48px]"
          >
            How I got here
          </h2>
          <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-slate lg:text-[17px]">
            A look back at the milestones, lessons, and turning points that shaped how I build
            today.
          </p>
        </div>

        <div className="receipt-column mt-12 lg:col-span-8 lg:mt-0">
          <div ref={paperRef} className="receipt-paper receipt-text">
            <p className="receipt-header">
              <span className="receipt-header-name">Monodip Bhattacharya</span>
              <span className="block">From electronics to full-stack</span>
            </p>

            <ol className="receipt-entries">
              {journey.map((entry, index) => (
                <ReceiptEntry key={entry.id} entry={entry} sequence={index + 1} />
              ))}
            </ol>

            <div className="receipt-footer">
              <dl>
                <div className="receipt-line">
                  <dt>Items</dt>
                  <dd>{journey.length}</dd>
                </div>
                <div className="receipt-line">
                  <dt>Now</dt>
                  <dd>{AVAILABILITY}</dd>
                </div>
              </dl>
              <p className="receipt-key-row">
                <ReceiptTalkKey />
              </p>
            </div>

            {/* Fresh ink: sticks right above the printer's slot (see .receipt-ink). */}
            <div aria-hidden="true" className="receipt-ink" />

            {/* The last edge of the paper: once it is above the slot, printing is over. */}
            <span data-receipt-end="" aria-hidden="true" className="receipt-end" />
          </div>

          <Printer paperRef={paperRef} total={journey.length} />
        </div>
      </div>
    </section>
  );
};

export default Timeline;
