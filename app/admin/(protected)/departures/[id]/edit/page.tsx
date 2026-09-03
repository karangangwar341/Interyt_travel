import { notFound } from "next/navigation";
import { getTripOptions, getUpcomingTripForEdit } from "@/lib/data/admin-upcoming-trips";
import { UpcomingTripForm } from "@/components/admin/departures/UpcomingTripForm";

export default async function EditDeparturePage({ params }: { params: { id: string } }) {
  const [trips, departure] = await Promise.all([
    getTripOptions(),
    getUpcomingTripForEdit(params.id),
  ]);
  if (!departure) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-serif text-2xl text-charcoal">Edit Departure</h1>
      <p className="mb-6 text-sm text-charcoal/55">Update this scheduled departure.</p>
      <UpcomingTripForm trips={trips} initial={departure} />
    </div>
  );
}
