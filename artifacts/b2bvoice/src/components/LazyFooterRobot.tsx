import { lazy, Suspense, useEffect, useRef, useState } from "react";

// The 3D robot pulls in three.js + react-three-fiber (~900 KB before gzip),
// which is more than the rest of the site's JavaScript together. It only
// exists on the footer, so its code is fetched when the footer is about to
// scroll into view (never on phones, where the slot is display:none).
const FooterRobot = lazy(() =>
  import("@/components/ui/robot-hero").then((m) => ({ default: m.FooterRobot })),
);

export function LazyFooterRobot({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The wrapper owns the size, so nothing shifts when the robot appears.
  return (
    <div ref={ref} className={`relative pointer-events-auto ${className}`}>
      {show && (
        <Suspense fallback={null}>
          <FooterRobot className="h-full w-full" />
        </Suspense>
      )}
    </div>
  );
}
