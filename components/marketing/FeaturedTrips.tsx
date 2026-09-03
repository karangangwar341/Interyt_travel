import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TripCard } from "./TripCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getPublishedTrips } from "@/lib/data/trips";

export async function FeaturedTrips() {
  const allTrips = await getPublishedTrips();
  const trips = allTrips.slice(0, 6);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Handpicked"
            title="Featured Trips"
            description="A cross-section of our most-loved itineraries — from weekend escapes to full Himalayan expeditions."
          />
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-dark"
          >
            View all trips
            <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>

        <StaggerReveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <StaggerItem key={trip.id}>
              <TripCard trip={trip} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
