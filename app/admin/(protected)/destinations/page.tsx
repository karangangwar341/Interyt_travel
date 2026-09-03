import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllDestinationsForAdmin } from "@/lib/data/admin-destinations";
import { DestinationsTable } from "@/components/admin/destinations/DestinationsTable";

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: { search?: string; region?: string; published?: "ALL" | "PUBLISHED" | "DRAFT" };
}) {
  const destinations = await getAllDestinationsForAdmin({
    search: searchParams.search,
    region: searchParams.region,
    published: searchParams.published,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Destinations</h1>
          <p className="text-sm text-charcoal/55">Manage every destination shown across the site.</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest to-forest-dark px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm shadow-forest/30"
        >
          <Plus size={16} /> New Destination
        </Link>
      </div>

      <DestinationsTable
        destinations={destinations}
        initialSearch={searchParams.search ?? ""}
        initialRegion={searchParams.region ?? "ALL"}
        initialPublished={searchParams.published ?? "ALL"}
      />
    </div>
  );
}
