import { cn } from "../../lib/utils";
import Led from "./Led";

/**
 * A slide switch on the calculator's control strip: LED (lit = on), a slot
 * with a sliding knob, and a lowercase silkscreen label. A real
 * `<button aria-pressed>`; the hit area is 44 px tall even though the strip
 * is drawn shorter.
 *
 * @param {object} props
 * @param {string} props.label Visible silkscreen text.
 * @param {string} [props.accessibleName] When the visible label needs more
 *   words to make sense on its own (it must contain the visible label).
 * @param {boolean} props.isOn
 * @param {(next: boolean) => void} props.onToggle
 * @param {string} [props.describedById]
 * @param {string} [props.className]
 */
export default function ToggleSwitch({
  label,
  accessibleName,
  isOn,
  onToggle,
  describedById,
  className,
}) {
  return (
    <button
      type="button"
      aria-pressed={isOn}
      aria-label={accessibleName}
      aria-describedby={describedById}
      onClick={() => onToggle(!isOn)}
      className={cn("toggle-switch", className)}
    >
      <Led isLit={isOn} />
      <span aria-hidden="true" className="toggle-switch-slot">
        <span className="toggle-switch-knob" data-on={isOn ? "" : undefined} />
      </span>
      <span className="text-[12px] font-semibold leading-none text-slate">{label}</span>
    </button>
  );
}
