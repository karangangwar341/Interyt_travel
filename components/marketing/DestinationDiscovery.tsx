import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationCard } from "./DestinationCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getDestinationsByRegion, regionLabels } from "@/lib/data/destinations";
import type { Region } from "@/lib/data/types";

const featuredRegions: Region[] = ["NORTH", "WEST", "SOUTH", "NORTHEAST"];

export async function DestinationDiscovery() {
  const regionItems = await Promise.all(
    featuredRegions.map(async (region) => ({ region, items: await getDestinationsByRegion(region) })),
  );

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Explore India"
            title="Where will your story unfold?"
            description="From alpine valleys to sunlit coasts — a curated map of India's most rewarding regions."
          />
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark"
          >
            View all destinations
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
      </Container>

      <div className="mt-14 space-y-14">
        {regionItems.map(({ region, items }) => {
          if (items.length === 0) return null;
          return (
            <div key={region}>
              <Container>
                <h3 className="font-display text-xl text-charcoal">{regionLabels[region]}</h3>
              </Container>
              <StaggerReveal className="container mt-5 flex snap-x gap-5 overflow-x-auto pb-2">
                {items.map((destination) => (
                  <StaggerItem key={destination.id} className="w-64 shrink-0 snap-start md:w-72">
                    <DestinationCard destination={destination} />
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
