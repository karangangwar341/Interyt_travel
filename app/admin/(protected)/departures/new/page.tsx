import { getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { UpcomingTripForm } from "@/components/admin/departures/UpcomingTripForm";

export default async function NewDeparturePage() {
  const trips = await getTripOptions();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">New Departure</h1>
      <p className="mb-6 text-sm text-charcoal/55">Schedule a new departure date for an existing trip.</p>
      <UpcomingTripForm trips={trips} />
    </div>
  );
}
