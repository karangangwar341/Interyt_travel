import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest2 text-terracotta">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl leading-tight text-charcoal md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-charcoal/70">{description}</p>
      ) : null}
    </div>
  );
}
