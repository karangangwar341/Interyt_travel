import { getAllBookingsForAdmin } from "@/lib/data/admin-bookings";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const bookings = await getAllBookingsForAdmin({ status: searchParams.status });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Bookings</h1>
        <p className="text-sm text-charcoal/55">Confirmed bookings created from enquiries. Cancelling a booking releases its seats back to the departure.</p>
      </div>

      <BookingsTable bookings={bookings} initialStatus={searchParams.status ?? "ALL"} />
    </div>
  );
}
