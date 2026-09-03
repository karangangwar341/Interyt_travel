import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { getDestinationForEdit } from "@/lib/data/admin-destinations";
import { DestinationForm } from "@/components/admin/destinations/DestinationForm";
import { DestinationImageSection } from "@/components/admin/destinations/DestinationImageSection";

export default async function EditDestinationPage({ params }: { params: { id: string } }) {
  const destination = await getDestinationForEdit(params.id);
  if (!destination) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Edit Destination</h1>
          <p className="text-sm text-charcoal/55">{destination.name}</p>
        </div>
        <Link
          href={`/admin/destinations/${destination.id}/preview`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 px-4 py-2 text-sm font-medium text-charcoal hover:border-forest/40"
        >
          <Eye size={16} /> Preview
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-widest2 text-charcoal/45">Hero Image</h2>
        <DestinationImageSection destinationId={destination.id} initialHero={destination.heroImage} />
      </div>

      <DestinationForm initial={destination} />
    </div>
  );
}
