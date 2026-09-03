"use client";

import { useEffect, useState } from "react";

const gradients = [
  "linear-gradient(135deg, rgb(var(--color-forest-dark)) 0%, rgb(var(--color-forest)) 55%, rgb(var(--color-forest-light)) 100%)",
  "linear-gradient(135deg, rgb(var(--color-terracotta-dark)) 0%, rgb(var(--color-terracotta)) 55%, rgb(var(--color-terracotta-light)) 100%)",
  "linear-gradient(120deg, rgb(var(--color-forest)) 0%, rgb(var(--color-terracotta)) 50%, rgb(var(--color-gold)) 100%)",
  "linear-gradient(135deg, rgb(var(--color-charcoal)) 0%, rgb(var(--color-forest-dark)) 55%, rgb(var(--color-forest)) 100%)",
  "linear-gradient(120deg, rgb(var(--color-terracotta-dark)) 0%, rgb(var(--color-gold)) 55%, rgb(var(--color-gold-light)) 100%)",
];

export function GradientSlideshow({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className}>
      {gradients.map((gradient, i) => (
        <div
          key={gradient}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ background: gradient, opacity: i === active ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
