import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllTripsForAdmin } from "@/lib/data/admin-trips";
import { TripsTable } from "@/components/admin/trips/TripsTable";

export default async function AdminTripsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; sort?: "title" | "price" | "updated" };
}) {
  const trips = await getAllTripsForAdmin({
    search: searchParams.search,
    status: searchParams.status,
    sort: searchParams.sort,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Trips</h1>
          <p className="text-sm text-charcoal/55">Manage every packaged trip shown on the site.</p>
        </div>
        <Link
          href="/admin/trips/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
        >
          <Plus size={16} /> New Trip
        </Link>
      </div>

      <TripsTable trips={trips} initialSearch={searchParams.search ?? ""} initialStatus={searchParams.status ?? "ALL"} initialSort={searchParams.sort ?? "updated"} />
    </div>
  );
}
