import { cn } from "../../lib/utils";

/**
 * An indicator LED in its housing: a slate ring with a signal-orange core
 * that lights up. The housing is always visible, so the LED reads on any
 * keycap colour, including the orange "=" key. Decorative for assistive
 * technology: the state it reports is always also in text or ARIA
 * (aria-pressed, aria-current).
 */
export default function Led({ isLit, className }) {
  return (
    <span aria-hidden="true" className={cn("led", className)} data-lit={isLit ? "" : undefined} />
  );
}
