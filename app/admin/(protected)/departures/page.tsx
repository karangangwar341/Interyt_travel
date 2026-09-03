import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllUpcomingTripsForAdmin, getTripOptions } from "@/lib/data/admin-upcoming-trips";
import { DeparturesTable } from "@/components/admin/departures/DeparturesTable";

export default async function AdminDeparturesPage({
  searchParams,
}: {
  searchParams: { tripId?: string; status?: string };
}) {
  const [departures, trips] = await Promise.all([
    getAllUpcomingTripsForAdmin({ tripId: searchParams.tripId, status: searchParams.status }),
    getTripOptions(),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Upcoming Departures</h1>
          <p className="text-sm text-charcoal/55">Manage scheduled departures shown on the site. Past departures fade out automatically.</p>
        </div>
        <Link
          href="/admin/departures/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
        >
          <Plus size={16} /> New Departure
        </Link>
      </div>

      <DeparturesTable
        departures={departures}
        trips={trips}
        initialTripId={searchParams.tripId ?? "ALL"}
        initialStatus={searchParams.status ?? "ALL"}
      />
    </div>
  );
}
