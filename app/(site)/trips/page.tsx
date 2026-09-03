import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TripFilters } from "@/components/marketing/TripFilters";
import { TripCard } from "@/components/marketing/TripCard";
import { getPublishedTrips } from "@/lib/data/trips";
import { getAllDestinations } from "@/lib/data/destinations";
import type { Trip } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Trips & Packages",
  description:
    "Browse curated India trips — adventure, leisure, cultural, road trips and weekend escapes. Filter by destination, duration, budget and difficulty.",
};

function parseDurationRange(range: string | undefined): [number, number] | null {
  if (!range) return null;
  if (range === "10+") return [10, Infinity];
  const parts = range.split("-").map(Number);
  const min = parts[0];
  const max = parts[1];
  if (min === undefined || max === undefined || Number.isNaN(min) || Number.isNaN(max)) return null;
  return [min, max];
}

function parseBudgetMax(budget: string | undefined): number | null {
  switch (budget) {
    case "under20000":
      return 20000;
    case "under35000":
      return 35000;
    case "under50000":
      return 50000;
    default:
      return null;
  }
}

function filterTrips(trips: Trip[], params: Record<string, string | undefined>) {
  const durationRange = parseDurationRange(params.duration);
  const budgetMax = parseBudgetMax(params.budget);

  return trips.filter((trip) => {
    if (params.destination && trip.destinationSlug !== params.destination) return false;
    if (params.type && trip.tripType !== params.type) return false;
    if (params.difficulty && trip.difficulty !== params.difficulty) return false;
    if (durationRange && (trip.durationDays < durationRange[0] || trip.durationDays > durationRange[1])) return false;
    if (budgetMax !== null && trip.price > budgetMax) return false;
    if (params.family === "1" && !trip.tags.includes("family-friendly")) return false;
    if (params.honeymoon === "1" && !trip.tags.includes("honeymoon")) return false;
    return true;
  });
}

function sortTrips(trips: Trip[], sort: string | undefined) {
  const sorted = [...trips];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "duration":
      return sorted.sort((a, b) => a.durationDays - b.durationDays);
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return sorted;
  }
}

export default async function TripsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params: Record<string, string | undefined> = {
    destination: typeof searchParams.destination === "string" ? searchParams.destination : undefined,
    type: typeof searchParams.type === "string" ? searchParams.type : undefined,
    duration: typeof searchParams.duration === "string" ? searchParams.duration : undefined,
    budget: typeof searchParams.budget === "string" ? searchParams.budget : undefined,
    difficulty: typeof searchParams.difficulty === "string" ? searchParams.difficulty : undefined,
    family: typeof searchParams.family === "string" ? searchParams.family : undefined,
    honeymoon: typeof searchParams.honeymoon === "string" ? searchParams.honeymoon : undefined,
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
  };

  const [allTrips, destinations] = await Promise.all([getPublishedTrips(), getAllDestinations()]);
  const filtered = sortTrips(filterTrips(allTrips, params), params.sort);

  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Trips & Packages"
          title="Find your next trip"
          description="Every package is built by our travel experts — filter by destination, duration, budget and travel style."
        />

        <div className="mt-8">
          <Suspense fallback={null}>
            <TripFilters destinations={destinations} />
          </Suspense>
        </div>

        <p className="mt-6 text-sm text-charcoal/50">
          {filtered.length} {filtered.length === 1 ? "trip" : "trips"} found
        </p>

        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-charcoal/10 bg-warm-white p-10 text-center">
            <p className="text-base text-charcoal/70">
              No trips match those filters. Try widening your search, or let us build a custom itinerary for you.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
