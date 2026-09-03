import { cn } from "@/lib/utils";
import type { ScenicPattern, ScenicTone } from "@/lib/data/types";

// Every tone is a gradient built from the brand's two CSS-variable-driven
// colors, so it repaints automatically when [data-theme] changes.
const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

const toneStyles: Record<ScenicTone, { gradient: string; line: string }> = {
  forest: {
    gradient: `linear-gradient(135deg, ${c("--color-forest-dark")} 0%, ${c("--color-forest")} 55%, ${c("--color-forest-light")} 100%)`,
    line: c("--color-terracotta"),
  },
  terracotta: {
    gradient: `linear-gradient(135deg, ${c("--color-terracotta-dark")} 0%, ${c("--color-terracotta")} 55%, ${c("--color-terracotta-light")} 100%)`,
    line: c("--color-forest"),
  },
  sand: {
    gradient: `linear-gradient(135deg, ${c("--color-forest")} 0%, ${c("--color-terracotta-dark")} 60%, ${c("--color-terracotta")} 100%)`,
    line: c("--color-ivory"),
  },
  charcoal: {
    gradient: `linear-gradient(135deg, ${c("--color-charcoal")} 0%, ${c("--color-forest-dark")} 60%, ${c("--color-forest")} 100%)`,
    line: c("--color-terracotta"),
  },
};

function PatternPath({ pattern, line }: { pattern: ScenicPattern; line: string }) {
  switch (pattern) {
    case "mountains":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          <path d="M0 260 L120 140 L200 220 L300 90 L400 260" />
          <path d="M-20 300 L100 190 L220 300" />
          <path d="M180 300 L340 160 L440 300" />
        </g>
      );
    case "waves":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          <path d="M0 200 Q50 170 100 200 T200 200 T300 200 T400 200" />
          <path d="M0 230 Q50 200 100 230 T200 230 T300 230 T400 230" />
          <path d="M0 260 Q50 230 100 260 T200 260 T300 260 T400 260" />
        </g>
      );
    case "dunes":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          <path d="M-20 260 Q80 190 180 260 T380 260" />
          <path d="M-20 290 Q100 230 220 290 T420 290" />
        </g>
      );
    case "hills":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          <path d="M-20 240 Q80 160 180 240 T380 240" />
          <path d="M-20 280 Q100 210 220 280 T420 280" />
        </g>
      );
    case "forest":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          {[40, 110, 180, 250, 320].map((x, i) => (
            <path key={x} d={`M${x} ${290 - (i % 2) * 20} L${x - 20} 300 L${x + 20} 300 Z`} />
          ))}
        </g>
      );
    case "heritage":
      return (
        <g stroke={line} strokeWidth="2" fill="none" opacity="0.6">
          <path d="M60 300 V180 H340 V300" />
          <path d="M60 180 L200 100 L340 180" />
          <circle cx="200" cy="140" r="14" />
        </g>
      );
    default:
      return null;
  }
}

export function ScenicBlock({
  pattern,
  tone,
  label,
  className,
}: {
  pattern: ScenicPattern;
  tone: ScenicTone;
  label?: string;
  className?: string;
}) {
  const styles = toneStyles[tone];
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: styles.gradient }}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={label ? `Scenic illustration representing ${label}` : "Scenic illustration"}
      >
        <PatternPath pattern={pattern} line={styles.line} />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 40%, ${c("--color-charcoal", 0.75)} 100%)`,
        }}
      />
    </div>
  );
}
