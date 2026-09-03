import { z } from "zod";

export const analyticsEventSchema = z.object({
  eventType: z.enum(["PAGE_VIEW", "WHATSAPP_CLICK", "PHONE_CLICK", "ENQUIRY_SUBMITTED"]),
  page: z.string().min(1).max(300),
  tripId: z.string().optional(),
  destinationId: z.string().optional(),
  sessionId: z.string().min(1).max(100),
  source: z.string().max(100).optional(),
  device: z.enum(["MOBILE", "TABLET", "DESKTOP"]).optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
