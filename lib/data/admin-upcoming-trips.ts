import { prisma } from "@/lib/db";

export interface AdminUpcomingTripListItem {
  id: string;
  tripId: string;
  tripTitle: string;
  departureDate: string;
  returnDate: string;
  departureLocation: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  bookingDeadline: string;
  status: string;
  featured: boolean;
  isPast: boolean;
}

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getAllUpcomingTripsForAdmin(options?: {
  tripId?: string;
  status?: string;
}): Promise<AdminUpcomingTripListItem[]> {
  const rows = await prisma.upcomingTrip.findMany({
    where: {
      tripId: options?.tripId && options.tripId !== "ALL" ? options.tripId : undefined,
      status: options?.status && options.status !== "ALL" ? options.status : undefined,
    },
    include: { trip: { select: { title: true } } },
    orderBy: { departureDate: "asc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return rows.map((row) => ({
    id: row.id,
    tripId: row.tripId,
    tripTitle: row.trip.title,
    departureDate: toIso(row.departureDate),
    returnDate: toIso(row.returnDate),
    departureLocation: row.departureLocation,
    totalSeats: row.totalSeats,
    availableSeats: row.availableSeats,
    price: row.price,
    bookingDeadline: toIso(row.bookingDeadline),
    status: row.status,
    featured: row.featured,
    isPast: row.departureDate < today,
  }));
}

export interface AdminUpcomingTripRecord {
  id: string;
  tripId: string;
  departureDate: string;
  returnDate: string;
  departureLocation: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  bookingDeadline: string;
  status: string;
  featured: boolean;
}

export async function getUpcomingTripForEdit(id: string): Promise<AdminUpcomingTripRecord | null> {
  const row = await prisma.upcomingTrip.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.tripId,
    departureDate: toIso(row.departureDate),
    returnDate: toIso(row.returnDate),
    departureLocation: row.departureLocation,
    totalSeats: row.totalSeats,
    availableSeats: row.availableSeats,
    price: row.price,
    bookingDeadline: toIso(row.bookingDeadline),
    status: row.status,
    featured: row.featured,
  };
}

export async function getTripOptions(): Promise<{ id: string; title: string; price: number }[]> {
  return prisma.trip.findMany({
    select: { id: true, title: true, price: true },
    orderBy: { title: "asc" },
  });
}
