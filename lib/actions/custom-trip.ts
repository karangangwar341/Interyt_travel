"use server";

import { prisma } from "@/lib/db";
import { customTripSchema } from "@/lib/validations/enquiry";
import { trackEvent } from "@/lib/actions/analytics";
import type { FormState } from "./types";

export async function submitCustomTripRequest(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  raw.interests = formData.getAll("interests");

  const parsed = customTripSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.enquiry.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        travelDate: data.travelDate ? new Date(data.travelDate) : null,
        adults: data.adults,
        children: data.children,
        budget: data.budget || null,
        message: data.message || null,
        destinationInterest: data.destination || null,
        durationInterest: data.durationDays || null,
        travelStyle: data.travelStyle,
        interests: JSON.stringify(data.interests),
        source: "CUSTOM_TRIP",
        status: "NEW",
      },
    });

    await trackEvent({ eventType: "ENQUIRY_SUBMITTED", page: "/plan-your-trip", sessionId: "server", source: "CUSTOM_TRIP" });

    return { status: "success", message: "Thanks! We're building your custom itinerary." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong submitting your request. Please try again or reach us on WhatsApp.",
    };
  }
}
