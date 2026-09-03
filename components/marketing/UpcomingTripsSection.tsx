import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UpcomingTripCard } from "./UpcomingTripCard";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getPublicUpcomingTrips } from "@/lib/data/upcoming-trips";

export async function UpcomingTripsSection() {
  const allDepartures = await getPublicUpcomingTrips();
  const departures = allDepartures.slice(0, 6);
  if (departures.length === 0) return null;

  return (
    <section className="bg-warm-white py-20 md:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Departing Soon"
            title="Upcoming Trips"
            description="Real, scheduled departures — sorted by the soonest date, with live seat availability."
          />
        </Reveal>
        <StaggerReveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departures.map((departure) => (
            <StaggerItem key={departure.id}>
              <UpcomingTripCard departure={departure} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
