import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline gap-1.5 font-display", className)}>
      <span className="text-2xl leading-none text-forest">Bharat</span>
      <span className="text-2xl italic leading-none text-terracotta">Bhraman</span>
    </Link>
  );
}
