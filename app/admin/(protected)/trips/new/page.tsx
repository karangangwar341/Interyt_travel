import { getDestinationOptions } from "@/lib/data/admin-trips";
import { TripForm } from "@/components/admin/trips/TripForm";

export default async function NewTripPage() {
  const destinations = await getDestinationOptions();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">New Trip</h1>
      <p className="mb-6 text-sm text-charcoal/55">Fill in the core details. You can add images once the trip is created.</p>
      <TripForm destinations={destinations} />
    </div>
  );
}
