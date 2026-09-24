import { useEffect } from "react";

/** Marks the current (private) page as noindex while mounted; restores the previous value on unmount. */
export function useNoindex() {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) return;
    const previous = meta.content;
    meta.content = "noindex, nofollow";
    return () => {
      meta.content = previous;
    };
  }, []);
}
