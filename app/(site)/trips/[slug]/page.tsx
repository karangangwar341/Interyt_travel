import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TripDetailView } from "@/components/trip/TripDetailView";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { getPublishedTrips, getTripBySlug, getSimilarTrips } from "@/lib/data/trips";
import { getPublicUpcomingTripsForTrip } from "@/lib/data/upcoming-trips";

export async function generateStaticParams() {
  const trips = await getPublishedTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = await getTripBySlug(params.slug);
  if (!trip) return {};
  return {
    title: trip.seoTitle ?? `${trip.title} — ${trip.durationDays}D/${trip.durationNights}N`,
    description: trip.seoDescription ?? trip.overview,
  };
}

export default async function TripDetailPage({ params }: { params: { slug: string } }) {
  const trip = await getTripBySlug(params.slug);
  if (!trip) notFound();

  const [destination, departures, similarTrips] = await Promise.all([
    getDestinationBySlug(trip.destinationSlug),
    getPublicUpcomingTripsForTrip(trip.slug),
    getSimilarTrips(trip),
  ]);

  return (
    <TripDetailView trip={trip} destination={destination} departures={departures} similarTrips={similarTrips} />
  );
}
