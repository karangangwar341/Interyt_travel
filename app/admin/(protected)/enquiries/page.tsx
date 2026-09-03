import { getAllEnquiriesForAdmin } from "@/lib/data/admin-enquiries";
import { EnquiriesTable } from "@/components/admin/enquiries/EnquiriesTable";

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: { search?: string; source?: string; status?: string };
}) {
  const enquiries = await getAllEnquiriesForAdmin({
    search: searchParams.search,
    source: searchParams.source,
    status: searchParams.status,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Enquiries</h1>
        <p className="text-sm text-charcoal/55">Booking requests, custom trip requests, and contact messages from the site.</p>
      </div>

      <EnquiriesTable
        enquiries={enquiries}
        initialSearch={searchParams.search ?? ""}
        initialSource={searchParams.source ?? "ALL"}
        initialStatus={searchParams.status ?? "ALL"}
      />
    </div>
  );
}
