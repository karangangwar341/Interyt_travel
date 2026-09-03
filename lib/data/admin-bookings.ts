import { prisma } from "@/lib/db";

export interface AdminBookingListItem {
  id: string;
  customerName: string;
  phone: string;
  tripTitle: string;
  departureDate: string;
  departureLocation: string;
  travelers: number;
  amount: number;
  status: string;
  createdAt: string;
}

export async function getAllBookingsForAdmin(options?: { status?: string }): Promise<AdminBookingListItem[]> {
  const rows = await prisma.booking.findMany({
    where: {
      status: options?.status && options.status !== "ALL" ? options.status : undefined,
    },
    include: {
      enquiry: { select: { customerName: true, phone: true } },
      upcomingTrip: {
        select: { departureDate: true, departureLocation: true, trip: { select: { title: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    customerName: row.enquiry.customerName,
    phone: row.enquiry.phone,
    tripTitle: row.upcomingTrip.trip.title,
    departureDate: row.upcomingTrip.departureDate.toISOString().slice(0, 10),
    departureLocation: row.upcomingTrip.departureLocation,
    travelers: row.travelers,
    amount: row.amount,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}
