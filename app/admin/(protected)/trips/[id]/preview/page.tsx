import { notFound } from "next/navigation";
import { getTripByIdAny, getSimilarTrips } from "@/lib/data/trips";
import { getDestinationBySlug } from "@/lib/data/destinations";
import { getPublicUpcomingTripsForTrip } from "@/lib/data/upcoming-trips";
import { TripDetailView } from "@/components/trip/TripDetailView";

export default async function AdminTripPreviewPage({ params }: { params: { id: string } }) {
  const trip = await getTripByIdAny(params.id);
  if (!trip) notFound();

  const [destination, departures, similarTrips] = await Promise.all([
    getDestinationBySlug(trip.destinationSlug),
    getPublicUpcomingTripsForTrip(trip.slug),
    getSimilarTrips(trip),
  ]);

  return (
    <TripDetailView trip={trip} destination={destination} departures={departures} similarTrips={similarTrips} previewMode />
  );
}
