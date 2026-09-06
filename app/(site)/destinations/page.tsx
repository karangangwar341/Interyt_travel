import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "@/components/marketing/DestinationCard";
import { getAllDestinations, regionLabels } from "@/lib/data/destinations";
import type { Region } from "@/lib/data/types";

export const metadata: Metadata = {
  title: "Destinations in India",
  description:
    "Explore India region by region — from the Himalayan north to the beaches of the west, temple towns of the south, and the hills of the northeast.",
};

const regions: Region[] = ["NORTH", "WEST", "SOUTH", "EAST", "NORTHEAST"];

export default async function DestinationsPage() {
  const allDestinations = await getAllDestinations();
  const regionItems = regions.map((region) => ({
    region,
    items: allDestinations.filter((d) => d.region === region),
  }));

  return (
    <main className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Destinations"
          title="India, region by region"
          description="Every journey starts with a place. Browse destinations across India's five regions."
        />
      </Container>

      <div className="mt-14 space-y-14">
        {regionItems.map(({ region, items }) => {
          if (items.length === 0) return null;
          return (
            <div key={region}>
              <Container>
                <h2 className="font-display text-xl text-charcoal">{regionLabels[region]}</h2>
                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((destination) => (
                    <DestinationCard key={destination.id} destination={destination} />
                  ))}
                </div>
              </Container>
            </div>
          );
        })}
      </div>
    </main>
  );
}
