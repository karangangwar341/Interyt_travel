import { prisma } from "@/lib/db";
import type { UpcomingTrip } from "./types";

export { upcomingTrips } from "./upcoming-trips.seed";

function mapUpcomingTrip(row: {
  id: string;
  tripId: string;
  trip: { slug: string };
  departureDate: Date;
  returnDate: Date;
  departureLocation: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  bookingDeadline: Date;
  status: string;
  featured: boolean;
}): UpcomingTrip {
  return {
    id: row.id,
    tripSlug: row.trip.slug,
    departureDate: row.departureDate.toISOString().slice(0, 10),
    returnDate: row.returnDate.toISOString().slice(0, 10),
    departureLocation: row.departureLocation,
    totalSeats: row.totalSeats,
    availableSeats: row.availableSeats,
    price: row.price,
    bookingDeadline: row.bookingDeadline.toISOString().slice(0, 10),
    status: row.status as UpcomingTrip["status"],
    featured: row.featured,
  };
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isPastDeparture(departureDateIso: string) {
  return new Date(departureDateIso) < startOfToday();
}

export function daysUntil(dateIso: string) {
  const diff = new Date(dateIso).getTime() - startOfToday().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Bookable departures only: not past, not cancelled, not completed. */
export function isBookableDeparture(u: UpcomingTrip) {
  return !isPastDeparture(u.departureDate) && u.status !== "CANCELLED" && u.status !== "COMPLETED";
}

/** All upcoming departures (any status), used for admin/aggregate views. */
export async function getAllUpcomingTrips(): Promise<UpcomingTrip[]> {
  const rows = await prisma.upcomingTrip.findMany({
    include: { trip: { select: { slug: true } } },
    orderBy: { departureDate: "asc" },
  });
  return rows.map(mapUpcomingTrip);
}

/** All bookable departures, soonest first. */
export async function getPublicUpcomingTrips(): Promise<UpcomingTrip[]> {
  const all = await getAllUpcomingTrips();
  return all
    .filter(isBookableDeparture)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
}

export async function getPublicUpcomingTripsForTrip(tripSlug: string): Promise<UpcomingTrip[]> {
  const all = await getPublicUpcomingTrips();
  return all.filter((u) => u.tripSlug === tripSlug);
}

export async function getFeaturedUpcomingTrips(limit = 3): Promise<UpcomingTrip[]> {
  const all = await getPublicUpcomingTrips();
  return all.filter((u) => u.featured).slice(0, limit);
}

export const departureStatusLabels: Record<UpcomingTrip["status"], string> = {
  SEATS_AVAILABLE: "Seats Available",
  ALMOST_FULL: "Almost Full",
  SOLD_OUT: "Sold Out",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
