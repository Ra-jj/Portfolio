/**
 * The instrument's key map (design-plan section 6.2).
 *
 * This is the single source of truth for every navigation label, URL, section
 * id, keyboard shortcut and key LCD message. The hero keypad, the sticky bar, the
 * footer, the contact links and the keyboard shortcuts all read this file, so
 * a label, URL or id can only be wrong in one place.
 */

/** Every section id on the page, in page order. Old links rely on these. */
export const SECTION_IDS = Object.freeze([
  "hero",
  "timeline",
  "projects",
  "skills",
  "contact",
]);

export const GITHUB_URL = "https://github.com/Ra-jj";
export const LINKEDIN_URL =
  "https://www.linkedin.com/in/monodip-bhattacharya-b31768327/";
export const RESUME_URL = "/Monodip_Bhattacharya_Resume.pdf";

/** A 20x2 character LCD: no row may be longer than this. */
export const LCD_COLUMNS = 20;

/**
 * The sticky bar's mini LCD: one row of 12 characters. It shows row 1 of a
 * key's message, so every row 1 must fit in it.
 */
export const BAR_LCD_COLUMNS = 12;

/** LCD row 1 during the intro. */
export const LCD_TITLE = "MONODIP.PORTFOLIO";

/**
 * LCD row 2 cycles through these. Uppercase, 20 characters at most, and only
 * facts stated in the resume (public/Monodip_Bhattacharya_Resume.pdf) or in
 * src/constants:
 * - FULL-STACK DEVELOPER: resume summary, hero copy.
 * - B.TECH ECE GRADUATE: resume education (Aug 2022 to July 2026).
 * - ARDUINO TO REACT: the IoT internship (Arduino) and the React projects.
 * - REACT, NODE, MONGODB: resume summary and project stacks.
 * - BUILT CHATIFY, DONOR: src/constants/projects.js.
 */
export const TAGLINES = Object.freeze([
  "FULL-STACK DEVELOPER",
  "B.TECH ECE GRADUATE",
  "ARDUINO TO REACT",
  "REACT, NODE, MONGODB",
  "BUILT CHATIFY, DONOR",
]);

/** Availability status, shown next to a lit LED (hero, contact, receipt). */
export const AVAILABILITY = "Open to full-time roles";

export const KEY_KIND = Object.freeze({
  /** `<a href="#id">`: scrolls to a section on this page. */
  SECTION: "section",
  /** `<a target="_blank" rel="noopener noreferrer">`: opens a new tab. */
  EXTERNAL: "external",
  /** `<button type="button">`: acts on the device itself. */
  ACTION: "action",
});

/**
 * One entry per key, in keypad reading order.
 * - legend: the lowercase silkscreen text printed on the keycap.
 * - glyph: an extra symbol printed on the cap (hidden from screen readers).
 * - target: the section id an in-page key scrolls to.
 * - label: the accessible name.
 * - shortcut: the single-character keyboard shortcut, matched case-insensitively.
 * - lcd: [row 1, row 2] shown on hover or focus (preview) and on press
 *   (message); null when the key has no message.
 */
export const KEYS = Object.freeze(
  [
    {
      id: "journey",
      legend: "journey",
      kind: KEY_KIND.SECTION,
      target: "timeline",
      href: "#timeline",
      label: "Journey",
      shortcut: "J",
      lcd: ["> JOURNEY", "#timeline"],
    },
    {
      id: "projects",
      legend: "projects",
      kind: KEY_KIND.SECTION,
      target: "projects",
      href: "#projects",
      label: "Projects",
      shortcut: "P",
      lcd: ["> PROJECTS", "#projects"],
    },
    {
      id: "skills",
      legend: "skills",
      kind: KEY_KIND.SECTION,
      target: "skills",
      href: "#skills",
      label: "Skills",
      shortcut: "S",
      lcd: ["> SKILLS", "#skills"],
    },
    {
      id: "resume",
      legend: "resume",
      kind: KEY_KIND.EXTERNAL,
      href: RESUME_URL,
      label: "Resume (PDF, opens in a new tab)",
      shortcut: "R",
      lcd: ["> RESUME", "PDF, NEW TAB"],
    },
    {
      id: "github",
      legend: "github",
      kind: KEY_KIND.EXTERNAL,
      href: GITHUB_URL,
      label: "GitHub (opens in a new tab)",
      shortcut: "G",
      lcd: ["> GITHUB", "github.com/Ra-jj"],
    },
    {
      id: "linkedin",
      legend: "linkedin",
      kind: KEY_KIND.EXTERNAL,
      href: LINKEDIN_URL,
      label: "LinkedIn (opens in a new tab)",
      shortcut: "L",
      lcd: ["> LINKEDIN", "linkedin.com"],
    },
    {
      // Clears the LCD and replays the intro. From the shortcut while the
      // hero is off screen, it first navigates to #hero.
      id: "ac",
      legend: "ac",
      kind: KEY_KIND.ACTION,
      label: "AC, replay the display",
      shortcut: "C",
      lcd: null,
    },
    {
      id: "talk",
      legend: "let's talk",
      glyph: "=",
      kind: KEY_KIND.SECTION,
      target: "contact",
      href: "#contact",
      label: "Let's talk",
      shortcut: "=",
      lcd: ["= LET'S TALK", "#contact"],
    },
  ].map((key) => Object.freeze(key)),
);

export const KEYS_BY_ID = Object.freeze(
  Object.fromEntries(KEYS.map((key) => [key.id, key])),
);

/** Hero keypad layout: 3 columns; "talk" spans columns 2 and 3 of row 3. */
export const KEYPAD_ROWS = Object.freeze([
  Object.freeze(["journey", "projects", "skills"]),
  Object.freeze(["resume", "github", "linkedin"]),
  Object.freeze(["ac", "talk"]),
]);

/** Keys repeated in the sticky bar after the hero, in order. */
export const BAR_KEY_IDS = Object.freeze(["journey", "projects", "skills", "talk"]);

/** "Or find me on" keys in the contact panel, in order. */
export const CONTACT_LINK_IDS = Object.freeze(["linkedin", "github", "resume"]);

/** The sticky bar and footer control that returns to the hero. */
export const BACK_TO_CALCULATOR = Object.freeze({
  label: "Back to calculator",
  target: "hero",
  href: "#hero",
});

/** `Enter` also triggers this key, but only when nothing is focused. */
export const ENTER_SHORTCUT_KEY_ID = "talk";

/** localStorage key for the shortcuts switch ("on" or "off"). */
export const SHORTCUTS_STORAGE_KEY = "md.shortcuts";

const shortcutLetters = KEYS.map((key) => key.shortcut);

/** Visually hidden description of the shortcuts switch (aria-describedby). */
export const SHORTCUTS_DESCRIPTION = `Keyboard shortcuts: ${shortcutLetters
  .slice(0, -1)
  .join(", ")} and ${shortcutLetters[shortcutLetters.length - 1]}.`;

/**
 * Returns the key whose shortcut matches a KeyboardEvent.key value, or null.
 * Case-insensitive; only single characters match (so "Enter", "Tab" and
 * undefined keys from browser autofill never do).
 */
export function findKeyByShortcut(character) {
  if (typeof character !== "string" || character.length !== 1) return null;
  const wanted = character.toUpperCase();
  return KEYS.find((key) => key.shortcut === wanted) ?? null;
}

/**
 * Checks the table against the device's physical limits. Returns a list of
 * problems (empty when the table is valid). Run in development only.
 */
export function findKeyMapProblems() {
  const problems = [];
  const seenShortcuts = new Set();

  for (const key of KEYS) {
    if (key.kind === KEY_KIND.SECTION && !SECTION_IDS.includes(key.target)) {
      problems.push(`Key "${key.id}" targets "${key.target}", which is not in SECTION_IDS.`);
    }
    if (key.kind !== KEY_KIND.ACTION && !key.href) {
      problems.push(`Key "${key.id}" has no href.`);
    }
    if (seenShortcuts.has(key.shortcut)) {
      problems.push(`Shortcut "${key.shortcut}" is assigned to more than one key.`);
    }
    seenShortcuts.add(key.shortcut);
    for (const row of key.lcd ?? []) {
      if (row.length > LCD_COLUMNS) {
        problems.push(`Key "${key.id}" LCD row "${row}" is ${row.length} characters (max ${LCD_COLUMNS}).`);
      }
    }
    if (key.lcd && key.lcd[0].length > BAR_LCD_COLUMNS) {
      problems.push(`Key "${key.id}" LCD row 1 "${key.lcd[0]}" does not fit the ${BAR_LCD_COLUMNS}-column bar LCD.`);
    }
  }

  for (const line of [LCD_TITLE, ...TAGLINES]) {
    if (line.length > LCD_COLUMNS) {
      problems.push(`LCD line "${line}" is ${line.length} characters (max ${LCD_COLUMNS}).`);
    }
    if (line !== line.toUpperCase()) {
      problems.push(`LCD line "${line}" is not uppercase.`);
    }
  }

  return problems;
}

if (import.meta.env.DEV) {
  for (const problem of findKeyMapProblems()) {
    console.error(`navigation.js: ${problem}`);
  }
}
