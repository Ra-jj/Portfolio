import { KEYS_BY_ID, KEY_KIND } from "../../constants/navigation";
import { useInstrument } from "../../context/instrument";
import { usePressHold } from "../../hooks/usePressHold";
import { cn } from "../../lib/utils";

/**
 * A small keycap for an external key from the key map (resume, github,
 * linkedin) placed outside the calculator: the contact panel's "Or find me
 * on" keys and the footer's icon keys. URL and accessible name come from
 * src/constants/navigation.js, so they can only be wrong in one place.
 *
 * It presses only itself (not the hero key with the same id), shows its
 * message on the LCDs that are listening (the sticky bar's mini LCD), and
 * opens natively in a new tab: no preventDefault, no delay (design-plan 6.4).
 *
 * @param {object} props
 * @param {"resume" | "github" | "linkedin"} props.keyId
 * @param {string} props.className Keycap colour and size classes.
 * @param {import("react").ReactNode} props.children The cap's legend or icon.
 */
export default function ExternalKeyLink({ keyId, className, children }) {
  const { flashMessage } = useInstrument();
  const [isPressed, press] = usePressHold();
  const keyDef = KEYS_BY_ID[keyId];

  if (!keyDef || keyDef.kind !== KEY_KIND.EXTERNAL) {
    console.error(
      `ExternalKeyLink: "${keyId}" is not an external key in the key map (src/constants/navigation.js).`,
    );
    return null;
  }

  const handleClick = () => {
    press();
    if (keyDef.lcd) flashMessage(keyDef.lcd, { keyId: keyDef.id });
  };

  return (
    <a
      href={keyDef.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={keyDef.label}
      data-pressed={isPressed ? "" : undefined}
      onClick={handleClick}
      className={cn("keycap", className)}
    >
      {children}
    </a>
  );
}
