import type React from "react";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
}

const shinyButtonStyles = `
  @property --b2b-shiny-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  .b2b-shiny-cta {
    --b2b-shiny-bg: #00357a;
    --b2b-shiny-bg-subtle: #0a4b98;
    --b2b-shiny-fg: #ffffff;
    --b2b-shiny-highlight: #42d7ff;
    --b2b-shiny-highlight-subtle: #b8f2ff;
    isolation: isolate;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 3.5rem;
    padding: 1rem 2rem;
    cursor: pointer;
    outline-offset: 4px;
    border: 1px solid transparent;
    border-radius: 999px;
    color: var(--b2b-shiny-fg);
    background:
      linear-gradient(var(--b2b-shiny-bg), var(--b2b-shiny-bg)) padding-box,
      conic-gradient(
        from var(--b2b-shiny-angle),
        transparent 0deg,
        var(--b2b-shiny-highlight) 52deg,
        var(--b2b-shiny-highlight-subtle) 76deg,
        var(--b2b-shiny-highlight) 100deg,
        transparent 132deg,
        transparent 360deg
      ) border-box;
    box-shadow: inset 0 0 0 1px var(--b2b-shiny-bg-subtle), 0 10px 24px rgba(0, 53, 122, 0.16);
    transition: transform 240ms ease, box-shadow 240ms ease, filter 240ms ease;
    animation: b2b-shiny-rotate 3s linear infinite;
  }

  .b2b-shiny-cta::before,
  .b2b-shiny-cta::after {
    content: "";
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .b2b-shiny-cta::before {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.55) 1px, transparent 1px);
    background-size: 7px 7px;
    mask-image: linear-gradient(90deg, transparent, black 35%, transparent 80%);
    opacity: 0.18;
  }

  .b2b-shiny-cta::after {
    background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.28), transparent 68%);
    transform: translateX(-120%);
    transition: transform 700ms ease;
  }

  .b2b-shiny-cta > span {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .b2b-shiny-cta:hover,
  .b2b-shiny-cta:focus-visible {
    transform: translateY(-2px);
    filter: saturate(1.12);
    box-shadow: inset 0 0 0 1px var(--b2b-shiny-bg-subtle), 0 16px 30px rgba(0, 53, 122, 0.24);
  }

  .b2b-shiny-cta:hover::after,
  .b2b-shiny-cta:focus-visible::after {
    transform: translateX(120%);
  }

  .b2b-shiny-cta:active {
    transform: translateY(1px);
  }

  @keyframes b2b-shiny-rotate {
    to {
      --b2b-shiny-angle: 360deg;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .b2b-shiny-cta {
      animation: none;
    }
  }
`;

export function ShinyButton({
  children,
  onClick,
  href,
  className = "",
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: ShinyButtonProps) {
  const classes = `b2b-shiny-cta ${className}`;
  const content = <span>{children}</span>;

  return (
    <>
      <style>{shinyButtonStyles}</style>
      {href ? (
        <a href={href} onClick={onClick} aria-label={ariaLabel} data-testid={dataTestId} className={classes}>
          {content}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={ariaLabel} data-testid={dataTestId} className={classes}>
          {content}
        </button>
      )}
    </>
  );
}