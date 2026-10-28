import { useCallback, useEffect, useRef } from "react";
import { SECTION_IDS } from "../constants/navigation";
import { prefersReducedMotion } from "./useReducedMotion";

/** Wait before scrolling so the keycap press is seen (design-plan 6.4). */
const PRESS_TO_SCROLL_DELAY_MS = 120;

/** Events that mean the visitor has taken over scrolling. Never `scroll`. */
const INTERACTION_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];
const INTERACTION_LISTENER_OPTIONS = { capture: true, passive: true };

/** The section id named by location.hash, or null if it names none. */
function readHashSectionId() {
  const id = window.location.hash.slice(1);
  return SECTION_IDS.includes(id) ? id : null;
}

/**
 * True for a click the browser should handle itself: any modifier key (new
 * tab, new window, download), a non-primary button, or a click another
 * handler already took over.
 */
function isModifiedClick(event) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/**
 * In-page navigation for the instrument (design-plan 6.4). Call once, from
 * the InstrumentProvider.
 *
 * - goToSection(id): after a short press delay (none under reduced motion),
 *   pushes `#id` to history if it is not already the hash, scrolls the
 *   section to the top (smooth, or instant under reduced motion) and moves
 *   focus to its heading without a second scroll.
 * - followSectionLink(event, id): onClick handler for `<a href="#id">`. Leaves
 *   modified clicks to the browser; otherwise prevents the native jump and
 *   calls goToSection. Without JavaScript the anchor still works natively.
 * - On first mount, a hash naming a section is scrolled to, then again after
 *   web fonts and after window `load` (layout can still move), unless the
 *   visitor has already wheeled, touched, pressed a key or a pointer.
 * - On Back/Forward the browser restores the scroll position itself; this
 *   only calls `onPopState(sectionIdOrNull)` so state can re-sync.
 *
 * @param {{ onPopState?: (sectionId: string | null) => void }} [options]
 */
export function useSectionNavigation({ onPopState } = {}) {
  const pendingNavigation = useRef(null);
  const onPopStateRef = useRef(onPopState);

  useEffect(() => {
    onPopStateRef.current = onPopState;
  }, [onPopState]);

  const goToSection = useCallback((id, { delay, focus = true } = {}) => {
    if (!SECTION_IDS.includes(id)) {
      console.warn(`goToSection: "${id}" is not one of ${SECTION_IDS.join(", ")}.`);
      return false;
    }

    const reduced = prefersReducedMotion();
    const wait = delay ?? (reduced ? 0 : PRESS_TO_SCROLL_DELAY_MS);

    const navigate = () => {
      pendingNavigation.current = null;
      const section = document.getElementById(id);
      if (!section) {
        console.warn(`goToSection: no element with id "${id}" is in the page.`);
        return;
      }
      if (window.location.hash !== `#${id}`) {
        window.history.pushState(null, "", `#${id}`);
      }
      section.scrollIntoView({
        block: "start",
        behavior: reduced ? "auto" : "smooth",
      });
      if (focus) {
        // Each section heading has tabIndex={-1}; the hero's is its h1.
        section.querySelector("h1, h2")?.focus({ preventScroll: true });
      }
    };

    // A second press inside the delay replaces the first.
    clearTimeout(pendingNavigation.current);
    if (wait > 0) {
      pendingNavigation.current = setTimeout(navigate, wait);
    } else {
      navigate();
    }
    return true;
  }, []);

  const followSectionLink = useCallback(
    (event, id) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      goToSection(id);
    },
    [goToSection],
  );

  // Cancel a navigation still waiting on its press delay.
  useEffect(() => () => clearTimeout(pendingNavigation.current), []);

  // Shareable deep links: /#projects lands on Projects.
  useEffect(() => {
    const id = readHashSectionId();
    if (!id) return undefined;

    let interacted = false;
    let disposed = false;
    let repeatsLeft = 2; // once after fonts, once after load

    function stopWatchingInteraction() {
      INTERACTION_EVENTS.forEach((type) =>
        window.removeEventListener(type, markInteracted, INTERACTION_LISTENER_OPTIONS),
      );
    }
    function markInteracted() {
      interacted = true;
      stopWatchingInteraction();
    }
    function scrollToTarget() {
      if (disposed || interacted) return;
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
    }
    function repeat() {
      scrollToTarget();
      repeatsLeft -= 1;
      if (repeatsLeft <= 0) stopWatchingInteraction();
    }

    INTERACTION_EVENTS.forEach((type) =>
      window.addEventListener(type, markInteracted, INTERACTION_LISTENER_OPTIONS),
    );
    scrollToTarget();

    if (document.fonts?.ready) {
      document.fonts.ready.then(repeat, repeat);
    } else {
      repeat();
    }

    const handleLoad = () => repeat();
    if (document.readyState === "complete") {
      repeat();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      disposed = true;
      stopWatchingInteraction();
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => onPopStateRef.current?.(readHashSectionId());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return { goToSection, followSectionLink };
}
