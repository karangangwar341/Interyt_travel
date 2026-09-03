import { notFound } from "next/navigation";
import { getDestinationByIdAny } from "@/lib/data/destinations";
import { getTripsByDestination } from "@/lib/data/trips";
import { DestinationDetailView } from "@/components/destination/DestinationDetailView";

export default async function AdminDestinationPreviewPage({ params }: { params: { id: string } }) {
  const destination = await getDestinationByIdAny(params.id);
  if (!destination) notFound();

  const trips = await getTripsByDestination(destination.slug);

  return <DestinationDetailView destination={destination} trips={trips} previewMode />;
}
