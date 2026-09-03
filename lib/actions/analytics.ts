"use server";

import { prisma } from "@/lib/db";
import { analyticsEventSchema, type AnalyticsEventInput } from "@/lib/validations/analytics";

/**
 * Public, unauthenticated event sink for customer-facing pages (page views,
 * WhatsApp/phone clicks). Never throws — a tracking failure must never break
 * the page or form the visitor is actually using.
 */
export async function trackEvent(input: AnalyticsEventInput): Promise<void> {
  const parsed = analyticsEventSchema.safeParse(input);
  if (!parsed.success) return;
  const data = parsed.data;

  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        page: data.page,
        tripId: data.tripId || null,
        destinationId: data.destinationId || null,
        sessionId: data.sessionId,
        source: data.source || null,
        device: data.device || null,
      },
    });
  } catch {
    // Swallow — analytics must be best-effort only.
  }
}
