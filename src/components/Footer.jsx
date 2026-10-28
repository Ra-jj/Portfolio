import { PiCalculatorBold, PiGithubLogoBold, PiLinkedinLogoBold } from "react-icons/pi";
import { BACK_TO_CALCULATOR } from "../constants/navigation";
import { useInstrument } from "../context/instrument";
import { usePressHold } from "../hooks/usePressHold";
import ExternalKeyLink from "./calculator/ExternalKeyLink";

/** Icon keys, in order. Names and URLs come from the key map. */
const ICON_KEYS = Object.freeze([
  { keyId: "github", Icon: PiGithubLogoBold },
  { keyId: "linkedin", Icon: PiLinkedinLogoBold },
]);

/**
 * "Back to calculator": the same control as the sticky bar's, through the
 * same navigation function (press delay, #hero in history, smooth or
 * instant scroll, focus on the h1). Modified clicks are left to the browser.
 */
function BackToCalculatorKey() {
  const { followSectionLink } = useInstrument();
  const [isPressed, press] = usePressHold();

  const handleClick = (event) => {
    press();
    followSectionLink(event, BACK_TO_CALCULATOR.target);
  };

  return (
    <a
      href={BACK_TO_CALCULATOR.href}
      data-pressed={isPressed ? "" : undefined}
      onClick={handleClick}
      className="keycap keycap-panel small-key"
    >
      <PiCalculatorBold aria-hidden="true" className="small-key-icon" />
      <span className="keycap-legend">{BACK_TO_CALCULATOR.label}</span>
    </a>
  );
}

/**
 * The device's base strip (design-plan 7.7): name and year, the GitHub and
 * LinkedIn icon keys (44 px), and "Back to calculator". One row from sm;
 * stacked and left-aligned on phones.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-5 px-3 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-[15px] leading-snug text-slate">
          <span className="font-semibold text-ink">Monodip Bhattacharya</span>{" "}
          <span className="whitespace-nowrap">© {new Date().getFullYear()}</span>
        </p>

        <ul className="flex items-center gap-2">
          {ICON_KEYS.map(({ keyId, Icon }) => (
            <li key={keyId}>
              <ExternalKeyLink keyId={keyId} className="keycap-slate footer-icon-key">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </ExternalKeyLink>
            </li>
          ))}
        </ul>

        <BackToCalculatorKey />
      </div>
    </footer>
  );
}
