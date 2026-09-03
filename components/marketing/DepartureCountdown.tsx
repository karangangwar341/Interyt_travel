"use client";

import { useEffect, useState } from "react";
import { daysUntil } from "@/lib/data/upcoming-trips";

export function DepartureCountdown({ departureDate }: { departureDate: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(departureDate));
  }, [departureDate]);

  if (days === null || days < 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta-dark motion-safe:animate-fadeIn">
      {days === 0 ? "Departs today" : days === 1 ? "Starts tomorrow" : `Starts in ${days} days`}
    </span>
  );
}
