"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-terracotta to-terracotta-dark px-6 py-3.5 text-sm font-semibold text-charcoal shadow-sm shadow-terracotta/30 transition-all hover:shadow-md hover:shadow-terracotta/40 disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Submitting…" : children}
    </button>
  );
}
