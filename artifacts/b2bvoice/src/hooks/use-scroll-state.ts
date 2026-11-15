import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * True once the page has scrolled past `offset` px. Uses an
 * IntersectionObserver on a 1px sentinel at the top of the document instead of
 * a scroll listener that reads `window.scrollY`: no per-scroll-event JS and no
 * layout reads (the reads were forcing synchronous layouts while animations
 * had the layout dirty).
 */
export function useScrolledPast(offset: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = `position:absolute;top:${offset}px;left:0;width:1px;height:1px;pointer-events:none;visibility:hidden`;
    document.body.appendChild(sentinel);
    const io = new IntersectionObserver(([entry]) => {
      // Sentinel above the viewport's top edge => scrolled past `offset`.
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [offset]);

  return past;
}

/**
 * Scroll progress 0..1, updated at most once per animation frame. The document
 * height is cached via ResizeObserver, so the scroll handler only reads
 * `scrollY` (cheap) and never `scrollHeight` (forces layout).
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let docHeight = 0;
    let frame = 0;
    let last = -1;
    const measure = () => {
      docHeight = document.documentElement.scrollHeight - window.innerHeight;
    };
    const update = () => {
      frame = 0;
      const p = docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0;
      // ~0.5% steps are invisible on a 56px ring and avoid a re-render per frame.
      const rounded = Math.round(p * 200) / 200;
      if (rounded !== last) {
        last = rounded;
        setProgress(rounded);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

/**
 * Mutable "is this element on screen" flag for requestAnimationFrame loops
 * (read it inside useAnimationFrame and return early when false). A ref, not
 * state: toggling it never re-renders. Defaults to visible, so without
 * IntersectionObserver support the loop simply keeps running.
 */
export function useOnScreenRef(target: RefObject<Element | null>): { current: boolean } {
  const onScreen = useRef(true);

  useEffect(() => {
    const el = target.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      onScreen.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return onScreen;
}
