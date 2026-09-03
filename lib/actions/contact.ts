"use server";

import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validations/enquiry";
import { trackEvent } from "@/lib/actions/analytics";
import type { FormState } from "./types";

export async function submitContactMessage(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

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
        customerName: data.name,
        phone: data.phone,
        email: data.email || null,
        message: `Subject: ${data.subject}\n${data.message}`,
        source: "CONTACT_FORM",
        status: "NEW",
      },
    });

    await trackEvent({ eventType: "ENQUIRY_SUBMITTED", page: "/contact", sessionId: "server", source: "CONTACT_FORM" });

    return { status: "success", message: "Thanks for reaching out — we'll get back to you shortly." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again or reach us on WhatsApp.",
    };
  }
}
