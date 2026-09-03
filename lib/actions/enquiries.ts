"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-guard";
import { logAdminActivity } from "@/lib/admin-activity";
import type { ActionResult } from "@/lib/actions/trips";

const enquiryStatuses = ["NEW", "CONTACTED", "FOLLOW_UP", "QUOTED", "CONFIRMED", "CLOSED"] as const;

export async function setEnquiryStatus(id: string, status: (typeof enquiryStatuses)[number]): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const enquiry = await prisma.enquiry.update({ where: { id }, data: { status } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "enquiry.status_updated",
    entityType: "Enquiry",
    entityId: enquiry.id,
    description: `Marked enquiry from "${enquiry.customerName}" as ${status}`,
  });

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  return { success: true, data: undefined };
}

export async function deleteEnquiry(id: string): Promise<ActionResult<undefined>> {
  const session = await requireAdminSession();
  const enquiry = await prisma.enquiry.findUnique({ where: { id }, include: { bookings: true } });
  if (!enquiry) return { success: false, message: "Enquiry not found." };

  if (enquiry.bookings.length > 0) {
    return { success: false, message: "Cannot delete an enquiry that has bookings. Cancel the booking(s) first." };
  }

  await prisma.enquiry.delete({ where: { id } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "enquiry.deleted",
    entityType: "Enquiry",
    entityId: id,
    description: `Deleted enquiry from "${enquiry.customerName}"`,
  });

  revalidatePath("/admin/enquiries");
  return { success: true, data: undefined };
}

export async function createBookingFromEnquiry(
  enquiryId: string,
  input: { travelers: number; amount: number },
): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdminSession();
  const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId }, include: { upcomingTrip: true } });
  if (!enquiry) return { success: false, message: "Enquiry not found." };
  if (!enquiry.upcomingTripId || !enquiry.upcomingTrip) {
    return { success: false, message: "This enquiry isn't linked to a specific departure, so it can't be converted into a booking." };
  }
  if (input.travelers < 1) {
    return { success: false, message: "Travelers must be at least 1." };
  }
  if (input.travelers > enquiry.upcomingTrip.availableSeats) {
    return { success: false, message: `Only ${enquiry.upcomingTrip.availableSeats} seat(s) available on this departure.` };
  }

  const booking = await prisma.booking.create({
    data: {
      enquiryId,
      upcomingTripId: enquiry.upcomingTripId,
      travelers: input.travelers,
      amount: input.amount,
      status: "PENDING",
    },
  });

  await prisma.upcomingTrip.update({
    where: { id: enquiry.upcomingTripId },
    data: { availableSeats: { decrement: input.travelers } },
  });

  await prisma.enquiry.update({ where: { id: enquiryId }, data: { status: "CONFIRMED" } });

  await logAdminActivity({
    adminId: session.user.id,
    action: "booking.created",
    entityType: "Booking",
    entityId: booking.id,
    description: `Created a booking for "${enquiry.customerName}" (${input.travelers} traveler${input.travelers === 1 ? "" : "s"})`,
  });

  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${enquiryId}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/departures");
  return { success: true, data: { id: booking.id } };
}
