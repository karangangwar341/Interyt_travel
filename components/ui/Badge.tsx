import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "accent";

const toneStyles: Record<Tone, string> = {
  success: "bg-success-light text-success",
  warning: "bg-terracotta-light/40 text-terracotta-dark",
  danger: "bg-danger-light text-danger",
  neutral: "bg-charcoal/5 text-charcoal/60",
  accent: "bg-forest/10 text-forest",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
