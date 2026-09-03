import { PlanYourTripForm } from "@/components/marketing/PlanYourTripForm";
import { getAllDestinations } from "@/lib/data/destinations";

export default async function PlanYourTripPage() {
  const destinations = await getAllDestinations();
  return <PlanYourTripForm destinations={destinations} />;
}
