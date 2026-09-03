import { BookingEnquiryForm } from "@/components/marketing/BookingEnquiryForm";
import { getTripBySlug } from "@/lib/data/trips";
import { getPublicUpcomingTripsForTrip } from "@/lib/data/upcoming-trips";

export default async function BookPage({
  searchParams,
}: {
  searchParams: { trip?: string; departure?: string };
}) {
  const tripSlug = searchParams.trip ?? "";
  const departureId = searchParams.departure ?? "";

  const trip = tripSlug ? await getTripBySlug(tripSlug) : undefined;
  const departures = trip ? await getPublicUpcomingTripsForTrip(trip.slug) : [];
  const selectedDeparture = departures.find((d) => d.id === departureId) ?? departures[0];

  return (
    <main>
      <BookingEnquiryForm tripSlug={tripSlug} trip={trip} selectedDeparture={selectedDeparture} />
    </main>
  );
}
