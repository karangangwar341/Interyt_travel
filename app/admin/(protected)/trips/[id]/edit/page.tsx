import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getDestinationOptions, getTripForEdit, getItineraryForTrip } from "@/lib/data/admin-trips";
import { TripForm } from "@/components/admin/trips/TripForm";
import { TripImagesSection } from "@/components/admin/trips/TripImagesSection";
import { ItineraryBuilder } from "@/components/admin/trips/ItineraryBuilder";

export default async function EditTripPage({ params }: { params: { id: string } }) {
  const [destinations, trip, itinerary] = await Promise.all([
    getDestinationOptions(),
    getTripForEdit(params.id),
    getItineraryForTrip(params.id),
  ]);
  if (!trip) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Edit Trip</h1>
          <p className="text-sm text-charcoal/55">{trip.title}</p>
        </div>
        <Link
          href={`/admin/trips/${trip.id}/preview`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
        >
          <Eye size={16} /> Preview
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Images</h2>
        <TripImagesSection tripId={trip.id} initialHero={trip.heroImage} initialGallery={trip.gallery} />
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Itinerary</h2>
        <ItineraryBuilder tripId={trip.id} initial={itinerary} />
      </div>

      <TripForm destinations={destinations} initial={trip} />
    </div>
  );
}
