import { forwardRef, useCallback, useEffect, useRef, useState, type ComponentType, type ForwardedRef } from "react";
import { m } from "framer-motion";

/**
 * Drop-in for framer-motion's `m` (import { motion } from here). Elements with an
 * endless animation (`transition={{ repeat: Infinity }}`) only animate while
 * they are on (or near) the screen. The home page has dozens of decorative
 * loops in mock UIs far below the fold; running them all the time kept the main
 * thread restyling thousands of elements per second.
 *
 * Everything else (one-shot animations, gestures, variants) is passed straight
 * through to `m`. Server markup is identical: the gate only acts after mount.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

function Looping({ Base, forwardedRef, props }: { Base: ComponentType<AnyProps & { ref?: unknown }>; forwardedRef: ForwardedRef<Element>; props: AnyProps }) {
  const inner = useRef<Element | null>(null);
  // null = not known yet: behave exactly like plain `m` (keeps server/client markup in sync).
  const [visible, setVisible] = useState<boolean | null>(null);

  const setRef = useCallback(
    (el: Element | null) => {
      inner.current = el;
      if (typeof forwardedRef === "function") forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    },
    [forwardedRef],
  );

  useEffect(() => {
    const el = inner.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Dropping `animate` stops the loop (framer settles the element on its base values).
  const next = visible === false ? { ...props, animate: undefined } : props;
  return <Base {...next} ref={setRef} />;
}

const cache = new Map<string, ComponentType<AnyProps>>();

function gated(tag: string): ComponentType<AnyProps> {
  let C = cache.get(tag);
  if (!C) {
    const Base = (m as unknown as Record<string, ComponentType<AnyProps & { ref?: unknown }>>)[tag];
    const Comp = forwardRef<Element, AnyProps>((props, ref) =>
      props.transition?.repeat === Infinity ? (
        <Looping Base={Base} forwardedRef={ref} props={props} />
      ) : (
        <Base {...props} ref={ref} />
      ),
    );
    Comp.displayName = `motion.${tag}`;
    C = Comp as unknown as ComponentType<AnyProps>;
    cache.set(tag, C);
  }
  return C;
}

export const motion = new Proxy(m, {
  get: (target, prop, receiver) =>
    typeof prop === "string" && /^[a-z]+$/.test(prop) && Reflect.get(target, prop, receiver) ? gated(prop) : Reflect.get(target, prop, receiver),
}) as typeof m;
