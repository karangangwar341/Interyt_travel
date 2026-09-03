import { Hero } from "@/components/marketing/Hero";
import { TravelSearch } from "@/components/marketing/TravelSearch";
import { DestinationDiscovery } from "@/components/marketing/DestinationDiscovery";
import { TrustStats } from "@/components/marketing/TrustStats";
import { UpcomingTripsSection } from "@/components/marketing/UpcomingTripsSection";
import { FeaturedTrips } from "@/components/marketing/FeaturedTrips";
import { FeaturedTestimonials } from "@/components/marketing/FeaturedTestimonials";
import { TopBlogs } from "@/components/marketing/TopBlogs";
import { GlobalFaqSection } from "@/components/marketing/GlobalFaqSection";
import { getAllDestinations } from "@/lib/data/destinations";
import { getPublishedTrips } from "@/lib/data/trips";

export default async function HomePage() {
  const [destinations, trips] = await Promise.all([getAllDestinations(), getPublishedTrips()]);

  return (
    <main>
      <Hero destinationCount={destinations.length} tripCount={trips.length} />
      <TravelSearch destinations={destinations} />
      <DestinationDiscovery />
      <TrustStats />
      <UpcomingTripsSection />
      <FeaturedTrips />
      <FeaturedTestimonials />
      <TopBlogs />
      <GlobalFaqSection />
    </main>
  );
}
