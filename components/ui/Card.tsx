import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-charcoal/10 bg-ivory shadow-md shadow-charcoal/5 transition-shadow duration-300 ease-smooth hover:shadow-xl hover:shadow-charcoal/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
