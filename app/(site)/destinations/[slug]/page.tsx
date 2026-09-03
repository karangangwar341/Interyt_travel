import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllDestinations, getDestinationBySlug } from "@/lib/data/destinations";
import { getTripsByDestination } from "@/lib/data/trips";
import { DestinationDetailView } from "@/components/destination/DestinationDetailView";

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const destination = await getDestinationBySlug(params.slug);
  if (!destination) return {};
  return {
    title: destination.seoTitle ?? `${destination.name} Travel Guide & Trips`,
    description: destination.seoDescription ?? destination.summary,
  };
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const destination = await getDestinationBySlug(params.slug);
  if (!destination) notFound();

  const trips = await getTripsByDestination(destination.slug);

  return <DestinationDetailView destination={destination} trips={trips} />;
}
