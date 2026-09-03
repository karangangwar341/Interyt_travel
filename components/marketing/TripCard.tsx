import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { PhotoOrScenic } from "@/components/ui/PhotoOrScenic";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { tripTypeLabels } from "@/lib/data/trips";
import { formatPrice } from "@/lib/format";
import type { Trip } from "@/lib/data/types";

export async function TripCard({ trip }: { trip: Trip }) {
  const destination = await getDestinationBySlug(trip.destinationSlug);

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group block overflow-hidden rounded-2xl border border-charcoal/10 bg-ivory shadow-md shadow-charcoal/5 transition-shadow duration-300 ease-smooth hover:shadow-xl hover:shadow-charcoal/15"
    >
      <div className="relative h-52 overflow-hidden">
        <PhotoOrScenic
          image={trip.heroImage}
          pattern={trip.scenic.pattern}
          tone={trip.scenic.tone}
          alt={trip.title}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
          className="h-full w-full transition-transform duration-500 ease-smooth group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-charcoal backdrop-blur">
          {tripTypeLabels[trip.tripType]}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs uppercase tracking-widest2 text-charcoal/45">
          {destination?.name ?? trip.states.join(", ")}
        </p>
        <h3 className="mt-1.5 font-display text-xl leading-snug text-charcoal">{trip.title}</h3>

        <div className="mt-3 flex items-center gap-4 text-sm text-charcoal/60">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden />
            {trip.durationDays}D / {trip.durationNights}N
          </span>
          {trip.rating ? (
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-gold text-gold" aria-hidden />
              {trip.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {trip.highlights.slice(0, 2).map((h) => (
            <li
              key={h}
              className="rounded-full bg-forest/8 px-2.5 py-1 text-xs text-forest-dark"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between border-t border-charcoal/10 pt-4">
          <div>
            <p className="text-xs text-charcoal/50">Starting from</p>
            <p className="text-lg font-semibold text-charcoal">{formatPrice(trip.price, trip.currency)}</p>
          </div>
          <span className="text-sm font-medium text-terracotta-dark">View Trip →</span>
        </div>
      </div>
    </Link>
  );
}
