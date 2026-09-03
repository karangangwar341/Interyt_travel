import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { cn } from "@/lib/utils";
import type { Destination } from "@/lib/data/types";

export function DestinationCard({
  destination,
  className,
}: {
  destination: Destination;
  className?: string;
}) {
  return (
    <Link href={`/destinations/${destination.slug}`} className={cn("group block", className)}>
      <div className="relative h-80 overflow-hidden rounded-2xl shadow-md shadow-charcoal/10 transition-shadow duration-300 ease-smooth group-hover:shadow-xl group-hover:shadow-charcoal/20">
        <PhotoOrScenic
          image={destination.heroImage}
          pattern={destination.scenic.pattern}
          tone={destination.scenic.tone}
          alt={destination.name}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
          className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
          <p className="text-xs uppercase tracking-widest2 text-ivory/70">{destination.state}</p>
          <h3 className="mt-1 flex items-center gap-1.5 font-display text-2xl">
            {destination.name}
            <ArrowUpRight
              size={18}
              className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
          </h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-charcoal/65">{destination.summary}</p>
    </Link>
  );
}
