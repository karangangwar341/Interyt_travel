"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import type { ActionResult } from "@/lib/actions/trips";

const bookingStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;
type BookingStatus = (typeof bookingStatuses)[number];

function isSeatHolding(status: BookingStatus) {
  return status === "PENDING" || status === "CONFIRMED" || status === "COMPLETED";
}

function revalidateBookingPaths() {
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/departures");
  revalidatePath("/admin/enquiries");
}

export async function setBookingStatus(id: string, status: BookingStatus): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const booking = await prisma.booking.findUnique({ where: { id }, include: { enquiry: true } });
  if (!booking) return { success: false, message: "Booking not found." };

  const wasHolding = isSeatHolding(booking.status as BookingStatus);
  const willHold = isSeatHolding(status);

  if (wasHolding && !willHold) {
    await prisma.upcomingTrip.update({ where: { id: booking.upcomingTripId }, data: { availableSeats: { increment: booking.travelers } } });
  } else if (!wasHolding && willHold) {
    const upcoming = await prisma.upcomingTrip.findUnique({ where: { id: booking.upcomingTripId } });
    if (upcoming && upcoming.availableSeats < booking.travelers) {
      return { success: false, message: `Only ${upcoming.availableSeats} seat(s) available — cannot re-activate this booking.` };
    }
    await prisma.upcomingTrip.update({ where: { id: booking.upcomingTripId }, data: { availableSeats: { decrement: booking.travelers } } });
  }

  await prisma.booking.update({ where: { id }, data: { status } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "booking.status_updated",
    entityType: "Booking",
    entityId: id,
    description: `Marked booking for "${booking.enquiry.customerName}" as ${status}`,
  });

  revalidateBookingPaths();
  return { success: true, data: undefined };
}

export async function deleteBooking(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const booking = await prisma.booking.findUnique({ where: { id }, include: { enquiry: true } });
  if (!booking) return { success: false, message: "Booking not found." };

  if (isSeatHolding(booking.status as BookingStatus)) {
    await prisma.upcomingTrip.update({ where: { id: booking.upcomingTripId }, data: { availableSeats: { increment: booking.travelers } } });
  }

  await prisma.booking.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "booking.deleted",
    entityType: "Booking",
    entityId: id,
    description: `Deleted booking for "${booking.enquiry.customerName}"`,
  });

  revalidateBookingPaths();
  return { success: true, data: undefined };
}
