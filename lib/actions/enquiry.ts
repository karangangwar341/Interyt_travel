"use server";

import { prisma } from "@/lib/db";
import { bookingEnquirySchema } from "@/lib/validations/enquiry";
import { getTripBySlug } from "@/lib/data/trips";
import { trackEvent } from "@/lib/actions/analytics";
import type { FormState } from "./types";

export async function submitBookingEnquiry(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = bookingEnquirySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const trip = data.tripSlug ? await getTripBySlug(data.tripSlug) : undefined;

  try {
    await prisma.enquiry.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        tripId: trip?.id ?? null,
        upcomingTripId: data.upcomingTripId || null,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        adults: data.adults,
        children: data.children,
        rooms: data.rooms ?? null,
        budget: data.budget || null,
        message: data.message || null,
        source: "BOOKING_FORM",
        status: "NEW",
      },
    });

    await trackEvent({
      eventType: "ENQUIRY_SUBMITTED",
      page: data.tripSlug ? `/trips/${data.tripSlug}` : "/book",
      tripId: trip?.id,
      sessionId: "server",
      source: "BOOKING_FORM",
    });

    return { status: "success", message: "Thank you! Your enquiry has been received." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong submitting your enquiry. Please try again or reach us on WhatsApp.",
    };
  }
}
