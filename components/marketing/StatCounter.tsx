"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCounter({
  target,
  suffix = "",
  label,
  valueClassName,
  labelClassName,
}: {
  target: number;
  suffix?: string;
  label: string;
  valueClassName?: string;
  labelClassName?: string;
}) {
  const [value, setValue] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    if (shouldReduceMotion) {
      setValue(target);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [inView, target, shouldReduceMotion]);

  return (
    <div ref={ref} className="text-center">
      <p className={cn("font-display text-3xl md:text-4xl", valueClassName ?? "text-ivory")}>
        {value}
        {suffix}
      </p>
      <p className={cn("mt-1 text-xs uppercase tracking-widest2", labelClassName ?? "text-ivory/60")}>
        {label}
      </p>
    </div>
  );
}
