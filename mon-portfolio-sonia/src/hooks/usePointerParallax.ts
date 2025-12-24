import { useRef } from "react";

export const usePointerParallax = <T extends HTMLElement>() => {
  const containerRef = useRef<T | null>(null);
  const frameRequested = useRef(false);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (frameRequested.current) return;
    frameRequested.current = true;

    requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      frameRequested.current = false;
    });
  };

  const resetPointer = () => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };

  return { containerRef, handlePointerMove, resetPointer };
};
