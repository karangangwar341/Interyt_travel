"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import { upcomingTripInputSchema, type UpcomingTripInput } from "@/lib/validations/upcoming-trip";
import type { ActionResult } from "@/lib/actions/trips";

function revalidateDeparturePaths(tripSlug?: string) {
  revalidatePath("/admin/departures");
  revalidatePath("/trips");
  revalidatePath("/");
  if (tripSlug) revalidatePath(`/trips/${tripSlug}`);
}

export async function createUpcomingTrip(input: UpcomingTripInput): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdminSession();
  const parsed = upcomingTripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
  if (!trip) return { success: false, message: "Trip not found." };

  const departure = await prisma.upcomingTrip.create({
    data: {
      tripId: data.tripId,
      departureDate: new Date(data.departureDate),
      returnDate: new Date(data.returnDate),
      departureLocation: data.departureLocation,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      price: data.price,
      bookingDeadline: new Date(data.bookingDeadline),
      status: data.status,
      featured: data.featured,
    },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: "departure.created",
    entityType: "UpcomingTrip",
    entityId: departure.id,
    description: `Added a departure for "${trip.title}" on ${data.departureDate}`,
  });

  revalidateDeparturePaths(trip.slug);
  return { success: true, data: { id: departure.id } };
}

export async function updateUpcomingTrip(id: string, input: UpcomingTripInput): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const parsed = upcomingTripInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please fix the errors below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const existing = await prisma.upcomingTrip.findUnique({ where: { id }, include: { trip: true } });
  if (!existing) return { success: false, message: "Departure not found." };

  await prisma.upcomingTrip.update({
    where: { id },
    data: {
      tripId: data.tripId,
      departureDate: new Date(data.departureDate),
      returnDate: new Date(data.returnDate),
      departureLocation: data.departureLocation,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      price: data.price,
      bookingDeadline: new Date(data.bookingDeadline),
      status: data.status,
      featured: data.featured,
    },
  });

  await logAdminActivity({
    adminId: session.user.id,
    action: "departure.updated",
    entityType: "UpcomingTrip",
    entityId: id,
    description: `Updated departure for "${existing.trip.title}" on ${data.departureDate}`,
  });

  revalidateDeparturePaths(existing.trip.slug);
  return { success: true, data: undefined };
}

export async function deleteUpcomingTrip(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const existing = await prisma.upcomingTrip.findUnique({ where: { id }, include: { trip: true } });
  if (!existing) return { success: false, message: "Departure not found." };

  const bookingCount = await prisma.booking.count({ where: { upcomingTripId: id } });
  if (bookingCount > 0) {
    return { success: false, message: "Cannot delete a departure that already has bookings. Cancel it instead." };
  }

  await prisma.enquiry.updateMany({ where: { upcomingTripId: id }, data: { upcomingTripId: null } });
  await prisma.upcomingTrip.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "departure.deleted",
    entityType: "UpcomingTrip",
    entityId: id,
    description: `Deleted departure for "${existing.trip.title}"`,
  });

  revalidateDeparturePaths(existing.trip.slug);
  return { success: true, data: undefined };
}

export async function toggleDepartureFeatured(id: string, featured: boolean): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const departure = await prisma.upcomingTrip.update({ where: { id }, data: { featured }, include: { trip: true } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "departure.featured_toggled",
    entityType: "UpcomingTrip",
    entityId: id,
    description: `${featured ? "Featured" : "Unfeatured"} departure for "${departure.trip.title}"`,
  });

  revalidateDeparturePaths(departure.trip.slug);
  return { success: true, data: undefined };
}
