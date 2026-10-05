"use client";

import { useEffect, useRef, useState } from "react";

/** Compteur animé lorsqu'il entre dans le viewport. Les valeurs non numériques sont affichées telles quelles. */
export function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const target = Number(value);
  const isNumeric = Number.isFinite(target) && value.trim() !== "";
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const duration = reduce ? 1 : 1600;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(Math.round(target * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [isNumeric, target]);

  return (
    <span ref={ref} aria-label={`${value}${suffix}`}>
      <span aria-hidden="true">
        {display}
        {suffix}
      </span>
    </span>
  );
}
