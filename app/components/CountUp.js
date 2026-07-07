"use client";

import { useEffect, useRef, useState } from "react";

// Animates from 0 to `value` once on mount / when value changes.
// Respects reduced motion by jumping straight to the value.
export default function CountUp({ value, duration = 900, format = (n) => Math.round(n), className }) {
  const [n, setN] = useState(0);
  const ref = useRef();

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let start;
    const from = 0;
    const step = (t) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(from + (value - from) * eased);
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span className={className}>{format(n)}</span>;
}
