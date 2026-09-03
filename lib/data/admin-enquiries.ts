import { prisma } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";

export interface AdminEnquiryListItem {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  tripTitle: string | null;
  departureLabel: string | null;
  destinationInterest: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export async function getAllEnquiriesForAdmin(options?: {
  search?: string;
  source?: string;
  status?: string;
}): Promise<AdminEnquiryListItem[]> {
  const search = options?.search?.trim();

  const rows = await prisma.enquiry.findMany({
    where: {
      source: options?.source && options.source !== "ALL" ? options.source : undefined,
      status: options?.status && options.status !== "ALL" ? options.status : undefined,
      OR: search
        ? [{ customerName: { contains: search } }, { phone: { contains: search } }, { email: { contains: search } }]
        : undefined,
    },
    include: {
      trip: { select: { title: true } },
      upcomingTrip: { select: { departureDate: true, departureLocation: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email,
    tripTitle: row.trip?.title ?? null,
    departureLabel: row.upcomingTrip
      ? `${row.upcomingTrip.departureDate.toISOString().slice(0, 10)} from ${row.upcomingTrip.departureLocation}`
      : null,
    destinationInterest: row.destinationInterest,
    source: row.source,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

export interface AdminEnquiryDetail {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  tripId: string | null;
  tripTitle: string | null;
  upcomingTripId: string | null;
  upcomingTripLabel: string | null;
  upcomingTripAvailableSeats: number | null;
  travelDate: string | null;
  adults: number;
  children: number;
  rooms: number | null;
  budget: string | null;
  message: string | null;
  destinationInterest: string | null;
  durationInterest: string | null;
  travelStyle: string | null;
  interests: string[];
  source: string;
  status: string;
  createdAt: string;
  bookings: { id: string; travelers: number; amount: number; status: string }[];
}

export async function getEnquiryForAdmin(id: string): Promise<AdminEnquiryDetail | null> {
  const row = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      trip: { select: { id: true, title: true } },
      upcomingTrip: { select: { id: true, departureDate: true, departureLocation: true, availableSeats: true } },
      bookings: { select: { id: true, travelers: true, amount: true, status: true } },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email,
    tripId: row.tripId,
    tripTitle: row.trip?.title ?? null,
    upcomingTripId: row.upcomingTripId,
    upcomingTripLabel: row.upcomingTrip
      ? `${row.upcomingTrip.departureDate.toISOString().slice(0, 10)} from ${row.upcomingTrip.departureLocation}`
      : null,
    upcomingTripAvailableSeats: row.upcomingTrip?.availableSeats ?? null,
    travelDate: row.travelDate ? row.travelDate.toISOString().slice(0, 10) : null,
    adults: row.adults,
    children: row.children,
    rooms: row.rooms,
    budget: row.budget,
    message: row.message,
    destinationInterest: row.destinationInterest,
    durationInterest: row.durationInterest,
    travelStyle: row.travelStyle,
    interests: row.interests ? parseJsonArray<string>(row.interests) : [],
    source: row.source,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    bookings: row.bookings,
  };
}
