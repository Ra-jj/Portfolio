import { useCallback, useEffect, useRef, useState } from "react";

/** The sections the sticky bar can mark as active (the hero is not one). */
const ACTIVE_SECTION_IDS = Object.freeze([
  "timeline",
  "projects",
  "skills",
  "contact",
]);

/**
 * A thin band 45% to 50% down the viewport. The section crossing it is the
 * one being read (design-plan section 7.2).
 */
const ACTIVE_SECTION_ROOT_MARGIN = "-45% 0px -50% 0px";
const BAND_TOP = 0.45;
const BAND_BOTTOM = 0.5;

/**
 * Tracks which section is currently being read, with one IntersectionObserver
 * over the given sections (no scroll listener).
 *
 * @param {readonly string[]} [ids] Section ids in page order.
 * @returns {{ activeSection: string | null, resyncActiveSection: () => void }}
 *   activeSection is null while none of the sections crosses the band (for
 *   example on the hero). resyncActiveSection re-measures once on the next
 *   frame; call it after Back/Forward restores a scroll position.
 */
export function useActiveSection(ids = ACTIVE_SECTION_IDS) {
  const [activeSection, setActiveSection] = useState(null);
  const idsKey = ids.join(" ");
  const resyncFrame = useRef(0);

  useEffect(() => {
    const sectionIds = idsKey.split(" ");
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length !== sectionIds.length) {
      const missing = sectionIds.filter((id) => !document.getElementById(id));
      console.warn(`useActiveSection: no element found for id(s) ${missing.join(", ")}.`);
    }
    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const crossingBand = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossingBand.add(entry.target.id);
          else crossingBand.delete(entry.target.id);
        }
        // Two sections can share the band at a boundary; the earlier one in
        // page order wins.
        setActiveSection(sectionIds.find((id) => crossingBand.has(id)) ?? null);
      },
      { rootMargin: ACTIVE_SECTION_ROOT_MARGIN, threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [idsKey]);

  const resyncActiveSection = useCallback(() => {
    cancelAnimationFrame(resyncFrame.current);
    // One measurement on the next frame, after the browser has restored the
    // scroll position. Not a loop.
    resyncFrame.current = requestAnimationFrame(() => {
      const bandTop = window.innerHeight * BAND_TOP;
      const bandBottom = window.innerHeight * BAND_BOTTOM;
      const current = idsKey.split(" ").find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect ? rect.top < bandBottom && rect.bottom > bandTop : false;
      });
      setActiveSection(current ?? null);
    });
  }, [idsKey]);

  useEffect(() => () => cancelAnimationFrame(resyncFrame.current), []);

  return { activeSection, resyncActiveSection };
}
