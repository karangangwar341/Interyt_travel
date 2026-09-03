import { Users, Compass, MapPin, CalendarDays } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { StatCounter } from "./StatCounter";
import { StaggerReveal, StaggerItem } from "@/components/motion/StaggerReveal";
import { getPublishedTrips } from "@/lib/data/trips";
import { getAllUpcomingTrips } from "@/lib/data/upcoming-trips";

export async function TrustStats() {
  const [trips, upcomingTrips] = await Promise.all([getPublishedTrips(), getAllUpcomingTrips()]);
  const departureCityCount = new Set(upcomingTrips.map((u) => u.departureLocation)).size;
  const totalItineraryDays = trips.reduce((sum, t) => sum + t.durationDays, 0);

  const stats = [
    { icon: Users, target: 500, suffix: "+", label: "Happy Travelers" },
    { icon: Compass, target: 150, suffix: "+", label: "Trips Planned" },
    { icon: MapPin, target: departureCityCount, suffix: "", label: "Departure Cities" },
    { icon: CalendarDays, target: totalItineraryDays, suffix: "", label: "Itinerary Days Crafted" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-forest-light py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 85% 20%, rgb(var(--color-terracotta) / 0.35), transparent 60%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest2 text-gold-light">Why Travel With Us</p>
            <h2 className="mt-3 font-display text-2xl text-ivory md:text-3xl">Trusted by travelers across India</h2>
          </div>
          <p className="text-[10px] uppercase tracking-widest2 text-ivory/40">
            Preview figures — updated as we grow
          </p>
        </div>

        <StaggerReveal className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="flex flex-col items-center rounded-2xl border border-ivory/10 bg-ivory/5 px-4 py-6 backdrop-blur-sm">
                <stat.icon className="mb-3 text-gold-light" size={22} aria-hidden />
                <StatCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  label={stat.label}
                  valueClassName="text-ivory"
                  labelClassName="text-ivory/65"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </Container>
    </section>
  );
}
