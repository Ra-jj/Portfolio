import { useEffect, useState } from "react";

function resolveElement(target) {
  if (typeof target === "string") return document.getElementById(target);
  return target?.current ?? null;
}

/**
 * Reports whether an element intersects the viewport (or `root`), using an
 * IntersectionObserver (never a scroll listener).
 *
 * @param {import("react").RefObject<Element> | string} target A ref, or the
 *   id of an element rendered by another component (for example "hero").
 *   The element is looked up once when the effect runs, so it must already be
 *   in the DOM when the component using this hook mounts.
 * @param {object} [options]
 * @param {Element | null} [options.root] Scroll container; null = viewport.
 * @param {string} [options.rootMargin] Same syntax as CSS margin.
 * @param {number | number[]} [options.threshold]
 * @param {boolean} [options.once] Stop observing after the first intersection,
 *   so the result stays true.
 * @param {boolean} [options.initialInView] Value before the first report.
 * @returns {boolean}
 */
export function useInView(
  target,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    once = false,
    initialInView = false,
  } = {},
) {
  const [inView, setInView] = useState(initialInView);
  // Compare thresholds by value so an inline array does not re-create the
  // observer on every render.
  const thresholdKey = [].concat(threshold).join(",");

  useEffect(() => {
    const element = resolveElement(target);
    if (!element) {
      console.warn("useInView: the target element was not found in the DOM.", target);
      return undefined;
    }

    // Without IntersectionObserver nothing would ever report; treat the
    // element as visible so content that waits for it still appears.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries[entries.length - 1];
        setInView(latest.isIntersecting);
        if (once && latest.isIntersecting) observer.disconnect();
      },
      { root, rootMargin, threshold: thresholdKey.split(",").map(Number) },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [target, root, rootMargin, thresholdKey, once]);

  return inView;
}
