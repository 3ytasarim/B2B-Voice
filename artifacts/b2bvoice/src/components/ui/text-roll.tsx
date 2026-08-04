import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRollProps {
  children: string;
  duration?: number;
  stagger?: number;
  repeatDelay?: number;
  className?: string;
}

export function TextRoll({
  children,
  duration = 0.45,
  stagger = 0.025,
  repeatDelay = 5,
  className,
}: TextRollProps) {
  const [cycle, setCycle] = useState(0);
  const animationLength = duration + Math.max(children.length - 1, 0) * stagger;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setCycle((current) => current + 1),
      (animationLength + repeatDelay) * 1000,
    );

    return () => window.clearTimeout(timeout);
  }, [animationLength, repeatDelay, cycle]);

  return (
    <span
      key={cycle}
      className={cn("inline-block", className)}
      aria-label={children}
    >
      <span aria-hidden="true">
        {children.split("").map((letter, index) => {
          const character = letter === " " ? "\u00a0" : letter;

          return (
            <span
              className="relative inline-block w-auto [perspective:10000px] [transform-style:preserve-3d]"
              key={`${cycle}-${index}`}
            >
              <motion.span
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 90 }}
                transition={{ duration, delay: index * stagger, ease: "easeIn" }}
                className="absolute inline-block origin-[50%_25%] [backface-visibility:hidden]"
              >
                {character}
              </motion.span>
              <motion.span
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration, delay: index * stagger, ease: "easeOut" }}
                className="absolute inline-block origin-[50%_100%] [backface-visibility:hidden]"
              >
                {character}
              </motion.span>
              <span className="invisible">{character}</span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}